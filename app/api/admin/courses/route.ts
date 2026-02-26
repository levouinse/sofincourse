import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { courseSchema, sanitizeMarkdown } from '@/lib/security'
import { cache } from '@/lib/redis-cache'
import { withAdmin } from '@/lib/auth-middleware'

// GET - Public access (no auth required)
export async function GET() {
  try {
    const cached = await cache.get<unknown[]>('admin-courses')
    if (cached) {
      return NextResponse.json({ courses: cached })
    }

    const supabase = await createClient()
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, slug, title, description, category, thumbnail_url, order_index, published, created_at')
      .order('order_index', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Courses fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch courses', courses: [] }, { status: 500 })
    }
    
    await cache.set('admin-courses', courses || [], 120)
    
    return NextResponse.json({ courses: courses || [] })
  } catch (error) {
    console.error('GET courses error:', error)
    return NextResponse.json({ error: 'Internal server error', courses: [] }, { status: 500 })
  }
}

// POST - Admin only
export async function POST(request: NextRequest) {
  return withAdmin(request, async (req) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const allowed = await cache.rateLimit(`course-create-${ip}`, 5, 60)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    try {
      const body = await req.json()
      
      // Validate with Zod
      const validated = courseSchema.parse(body)
      
      if (validated.description) {
        validated.description = sanitizeMarkdown(validated.description)
      }
      
      const supabase = await createClient()
      
      // Check if slug already exists
      const { data: existing } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', validated.slug)
        .maybeSingle()
      
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }

      // Insert course
      const { data, error } = await supabase
        .from('courses')
        .insert(validated)
        .select('id, slug, title, description, category, thumbnail_url, order_index, published, created_at')
        .single()

      if (error) {
        console.error('Course create error:', error)
        return NextResponse.json({ error: 'Failed to create course', details: error.message }, { status: 400 })
      }
      
      // Clear cache
      await cache.delete('admin-courses')
      
      return NextResponse.json(data, { status: 201 })
    } catch (error: unknown) {
      console.error('POST error:', error)
      if (error instanceof Error && error.name === 'ZodError') {
        return NextResponse.json({ error: 'Invalid input', details: (error as unknown as { errors: unknown }).errors }, { status: 400 })
      }
      return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
  })
}
