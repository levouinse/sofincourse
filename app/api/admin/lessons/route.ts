import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { lessonSchema, checkRateLimit, sanitizeMarkdown, isValidUUID } from '@/lib/security'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('course_id')
  
  // Validate UUID if provided - prevent injection
  if (courseId && !isValidUUID(courseId)) {
    return NextResponse.json({ error: 'Invalid course ID format' }, { status: 400 })
  }
  
  const supabase = await createClient()
  
  // Optimized query with index
  let query = supabase
    .from('lessons')
    .select('id, course_id, slug, title, content_markdown, video_url, video_provider, pdf_url, content_type, order_index, created_at')
    .order('order_index', { ascending: true })
    .limit(100)
  
  if (courseId) query = query.eq('course_id', courseId)
  
  const { data, error } = await query

  if (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json([])
  }
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Rate limiting - stricter
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`lesson-create-${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const validated = lessonSchema.parse(body)
    
    // Sanitize markdown content - prevent XSS
    if (validated.content_markdown) {
      validated.content_markdown = sanitizeMarkdown(validated.content_markdown)
    }
    
    // Verify course exists
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('id', validated.course_id)
      .single()
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert(validated)
      .select('id, course_id, slug, title, content_markdown, video_url, video_provider, pdf_url, content_type, order_index, created_at')
      .single()

    if (error) {
      console.error('Lesson create error:', error)
      return NextResponse.json({ error: 'Failed to create lesson' }, { status: 400 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (error: unknown) {
    console.error('POST error:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
