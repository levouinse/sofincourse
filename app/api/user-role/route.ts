import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cache } from '@/lib/redis-cache'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const allowed = await cache.rateLimit(`user-role-${ip}`, 30, 60)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const cacheKey = `user-role-${uid}`
    const cached = await cache.get<string>(cacheKey)
    if (cached) {
      return NextResponse.json({ role: cached })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('firebase_uid', uid)
      .maybeSingle()

    const role = user?.role || 'user'
    await cache.set(cacheKey, role, 300)

    return NextResponse.json({ role })
  } catch (error) {
    console.error('User role error:', error)
    return NextResponse.json({ role: 'user' })
  }
}
