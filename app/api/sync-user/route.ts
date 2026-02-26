import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/security'

export async function GET() {
  return NextResponse.json({ 
    message: 'Sync user endpoint. Use POST method with uid, email, displayName, photoURL' 
  })
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(`sync-user-${ip}`, 20, 60000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { uid, email, displayName, photoURL } = await request.json()

    if (!uid || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user exists by firebase_uid (if column exists)
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .maybeSingle()

    // If firebase_uid column doesn't exist yet, check by email
    if (queryError && queryError.code === '42703') {
      const { data: userByEmail } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()
      
      if (userByEmail) {
        return NextResponse.json({ success: true, userId: userByEmail.id })
      }
    } else if (existingUser) {
      return NextResponse.json({ success: true, userId: existingUser.id })
    }

    // Insert user profile directly (Firebase handles auth)
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        name: displayName || email,
        avatar_url: photoURL,
        role: 'user',
        firebase_uid: uid
      })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: data.id })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
