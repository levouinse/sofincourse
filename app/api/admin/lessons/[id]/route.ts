import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { lessonSchema, checkRateLimit, sanitizeMarkdown, isValidUUID } from '@/lib/security'

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
  if (!checkRateLimit(`lesson-update-${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const validated = lessonSchema.partial().parse(body)
    
    // Sanitize markdown content - prevent XSS
    if (validated.content_markdown) {
      validated.content_markdown = sanitizeMarkdown(validated.content_markdown)
    }

    const { data, error } = await supabase
      .from('lessons')
      .update(validated)
      .eq('id', id)
      .select('id, course_id, slug, title, content_markdown, video_url, video_provider, pdf_url, content_type, order_index, created_at')
      .single()

    if (error) {
      console.error('Lesson update error:', error)
      return NextResponse.json({ error: 'Failed to update lesson' }, { status: 400 })
    }
    if (!data) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
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
  if (!checkRateLimit(`lesson-delete-${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    // Check if lesson exists first
    const { data: existing } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', id)
      .single()
    
    if (!existing) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }
    
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Lesson delete error:', error)
      return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
