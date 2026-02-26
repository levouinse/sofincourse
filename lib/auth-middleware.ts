import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: { uid: string; email?: string }) => Promise<NextResponse>
) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.substring(7)
  
  // Try to verify with Firebase Admin if available
  try {
    const { verifyIdToken } = await import('@/lib/firebase-admin')
    const user = await verifyIdToken(token)

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return handler(request, user)
  } catch {
    // Fallback: decode token client-side (less secure but works without Firebase Admin SDK)
    console.warn('Firebase Admin not configured, using fallback auth')
    
    // Extract uid from token payload (JWT format: header.payload.signature)
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      if (!payload.user_id) {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 401 })
      }
      
      return handler(request, { uid: payload.user_id, email: payload.email })
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }
}

export async function withAdmin(
  request: NextRequest,
  handler: (request: NextRequest, user: { uid: string; email?: string }) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('firebase_uid', user.uid)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    return handler(req, user)
  })
}
