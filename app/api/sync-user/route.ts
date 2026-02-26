import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/security'

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

    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: displayName || email,
        avatar_url: photoURL
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Insert user profile with firebase_uid (if column exists)
    const insertData: any = {
      id: authData.user.id,
      email,
      name: displayName || email,
      avatar_url: photoURL,
      role: 'user'
    }

    // Try to add firebase_uid if column exists
    try {
      insertData.firebase_uid = uid
    } catch (e) {
      // Column doesn't exist yet, skip it
    }

    const { data, error } = await supabase
      .from('users')
      .insert(insertData)
      .select('id')
      .single()

    if (error) {
      console.error('Error creating user profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: data.id })
  } catch (error) {
    console.error('Sync user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
