import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface CachedStats {
  stats: { totalCourses: number; totalLessons: number; totalUsers: number; totalCompletions: number }
  users: unknown[]
  chartData: { name: string; value: number }[]
}

let cachedStats: CachedStats | null = null
let cacheTime = 0
const CACHE_DURATION = 30000

export async function GET(request: Request) {
  try {
    // Simple auth check: require any authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (cachedStats && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedStats)
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const [
      { count: coursesCount },
      { count: lessonsCount },
      { count: usersCount },
      { count: completionsCount },
      { data: users }
    ] = await Promise.all([
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('lessons').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('course_completions').select('*', { count: 'exact', head: true }),
      supabase
        .from('users')
        .select('id, email, name, avatar_url, role, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
    ])

    const { data: chartData } = await supabase
      .from('course_completions')
      .select('course_id, courses!inner(title)')
      .limit(1000)
      
    const completionsByCourse = (chartData as unknown as Array<{ courses?: { title?: string } }>)?.reduce((acc: Record<string, number>, item) => {
      const title = item.courses?.title || 'Unknown'
      acc[title] = (acc[title] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const result = {
      stats: {
        totalCourses: coursesCount || 0,
        totalLessons: lessonsCount || 0,
        totalUsers: usersCount || 0,
        totalCompletions: completionsCount || 0
      },
      users: users || [],
      chartData: Object.entries(completionsByCourse || {}).map(([name, value]) => ({ name, value }))
    }

    cachedStats = result
    cacheTime = Date.now()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      stats: { totalCourses: 0, totalLessons: 0, totalUsers: 0, totalCompletions: 0 },
      users: [],
      chartData: []
    }, { status: 500 })
  }
}
