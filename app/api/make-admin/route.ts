import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'change-this-in-production'

export async function POST(request: Request) {
  try {
    const { uid, secret } = await request.json()

    // Require secret key to prevent unauthorized access
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!uid) {
      return NextResponse.json({ error: 'No UID provided' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('firebase_uid', uid)
      .maybeSingle()

    if (existingUser) {
      const { data, error } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('firebase_uid', uid)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'User updated to admin',
        user: data 
      })
    }

    const { data: userById } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', uid)
      .maybeSingle()

    if (userById) {
      const { data, error } = await supabase
        .from('users')
        .update({ role: 'admin', firebase_uid: uid })
        .eq('id', uid)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'User updated to admin and firebase_uid set',
        user: data 
      })
    }

    return NextResponse.json({ 
      error: 'User not found in Supabase. Please sync user first.' 
    }, { status: 404 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
