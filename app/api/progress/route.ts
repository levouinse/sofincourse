import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cache } from '@/lib/redis-cache'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseSlug = searchParams.get('courseSlug')
  const firebaseUid = searchParams.get('uid')
  const authHeader = request.headers.get('authorization')

  if (!firebaseUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify the requesting user matches the uid (prevent IDOR)
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const { verifyIdToken } = await import('@/lib/firebase-admin')
    const user = await verifyIdToken(token)
    
    if (!user || user.uid !== firebaseUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const allowed = await cache.rateLimit(`progress-get-${ip}`, 30, 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const cacheKey = `progress-${firebaseUid}-${courseSlug || 'all'}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle()

    if (userError && userError.code === '42703') {
      return NextResponse.json({ stats: { completed: 0, inProgress: 0 } })
    }

    if (!user) {
      return NextResponse.json({ stats: { completed: 0, inProgress: 0 } })
    }

    if (courseSlug && courseSlug !== 'all') {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', courseSlug)
        .single()

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }

      const [progressResult, completionResult] = await Promise.all([
        supabase
          .from('user_lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .eq('course_id', course.id),
        supabase
          .from('course_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', course.id)
          .single()
      ])

      const result = {
        viewedLessons: progressResult.data?.map(p => p.lesson_id) || [],
        completed: !!completionResult.data
      }

      await cache.set(cacheKey, result, 60)
      return NextResponse.json(result)
    }

    const [completionsResult, progressResult] = await Promise.all([
      supabase
        .from('course_completions')
        .select('course_id, courses(slug)')
        .eq('user_id', user.id),
      supabase
        .from('user_lesson_progress')
        .select('course_id')
        .eq('user_id', user.id)
    ])

    const uniqueCourses = new Set(progressResult.data?.map(p => p.course_id) || [])
    const completedSlugs = completionsResult.data?.map(c => {
      const course = c.courses as unknown as { slug: string }
      return course.slug
    }) || []

    const result = {
      stats: {
        completed: completionsResult.data?.length || 0,
        inProgress: Math.max(0, uniqueCourses.size - (completionsResult.data?.length || 0))
      },
      completedCourses: completedSlugs
    }

    await cache.set(cacheKey, result, 60)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Progress GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const allowed = await cache.rateLimit(`progress-post-${ip}`, 20, 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const { courseSlug, lessonSlug, completed, firebaseUid } = body

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle()

    if (userError && userError.code === '42703') {
      return NextResponse.json({ success: true, message: 'Progress not saved (DB migration pending)' })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const [courseResult, lessonResult] = await Promise.all([
      supabase.from('courses').select('id').eq('slug', courseSlug).single(),
      supabase.from('lessons').select('id').eq('slug', lessonSlug).single()
    ])

    if (!courseResult.data || !lessonResult.data) {
      return NextResponse.json({ error: 'Course or lesson not found' }, { status: 404 })
    }

    await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonResult.data.id,
        course_id: courseResult.data.id,
        completed: true,
        last_accessed: new Date().toISOString()
      }, {
        onConflict: 'user_id,lesson_id'
      })

    if (completed) {
      const { data: existingCompletion } = await supabase
        .from('course_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseResult.data.id)
        .single()

      const isNewCompletion = !existingCompletion

      await supabase
        .from('course_completions')
        .upsert({
          user_id: user.id,
          course_id: courseResult.data.id,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,course_id'
        })

      await cache.delete(`progress-${firebaseUid}-${courseSlug}`)
      await cache.delete(`progress-${firebaseUid}-all`)

      return NextResponse.json({ success: true, newCompletion: isNewCompletion })
    }

    await cache.delete(`progress-${firebaseUid}-${courseSlug}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Progress POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
