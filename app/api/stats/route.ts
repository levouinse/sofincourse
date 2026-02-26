import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_STATS } from '@/lib/constants'
import { cache } from '@/lib/redis-cache'

export async function GET() {
  try {
    // Check cache first (5 min TTL)
    const cached = await cache.get('stats')
    if (cached) {
      return NextResponse.json(cached)
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Parallel queries for better performance
    const [coursesResult, lessonsResult, usersResult, categoriesResult] = await Promise.all([
      supabase.from('courses').select('*', { count: 'exact', head: true }).eq('published', true),
      supabase.from('lessons').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('category').eq('published', true)
    ])

    const categories = new Set(categoriesResult.data?.map(c => c.category) || [])

    const result = {
      courses: coursesResult.count || DEFAULT_STATS.courses,
      lessons: lessonsResult.count || DEFAULT_STATS.lessons,
      categories: categories.size || DEFAULT_STATS.categories,
      users: usersResult.count || DEFAULT_STATS.users
    }

    // Cache for 5 minutes
    await cache.set('stats', result, 300)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(DEFAULT_STATS)
  }
}

// Revalidate every 60 seconds
export const revalidate = 60

