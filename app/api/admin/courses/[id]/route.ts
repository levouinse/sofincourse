import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { courseSchema, checkRateLimit, isValidUUID, sanitizeMarkdown } from '@/lib/security'
import { cache } from '@/lib/redis-cache'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  // Validate UUID format - prevent injection
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
  }
  
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`course-update-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    
    // Validate with partial schema (allow updating only some fields)
    const validated = courseSchema.partial().parse(body)
    
    // Sanitize text fields
    if (validated.description) {
      validated.description = sanitizeMarkdown(validated.description)
    }
    
    // Check slug uniqueness if slug is being updated
    if (validated.slug) {
      const { data: existing } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', validated.slug)
        .neq('id', id)
        .maybeSingle()
      
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    // Update course
    const { data, error } = await supabase
      .from('courses')
      .update(validated)
      .eq('id', id)
      .select('id, slug, title, description, category, thumbnail_url, order_index, published, created_at')
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: 'Failed to update course' }, { status: 400 })
    }
    if (!data) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    
    // Invalidate cache
    cache.delete('admin-courses')
    
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error('PUT error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  // Validate UUID format - prevent injection
  if (!isValidUUID(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
  }
  
  // Rate limiting - stricter for delete
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`course-delete-${ip}`, 3, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    // Check if course exists first
    const { data: existing } = await supabase
      .from('courses')
      .select('id')
      .eq('id', id)
      .single()
    
    if (!existing) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    // Delete course (cascade will delete lessons)
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 400 })
    }
    
    // Invalidate cache
    cache.delete('admin-courses')
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
