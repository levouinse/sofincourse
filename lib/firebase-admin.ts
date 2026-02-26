import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let adminApp: App | undefined

// Initialize Firebase Admin SDK
function getAdminApp() {
  if (adminApp) return adminApp

  if (getApps().length > 0) {
    adminApp = getApps()[0]
    return adminApp
  }

  // For production, use service account JSON
  // For development, use project ID only (requires Firebase emulator or valid credentials)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  } else {
    // Fallback: use project ID (requires GOOGLE_APPLICATION_CREDENTIALS env var)
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }

  return adminApp
}

// Verify Firebase ID token
export async function verifyIdToken(idToken: string): Promise<{ uid: string; email?: string } | null> {
  try {
    const app = getAdminApp()
    const auth = getAuth(app)
    const decodedToken = await auth.verifyIdToken(idToken)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Get user by UID
export async function getUserByUid(uid: string) {
  try {
    const app = getAdminApp()
    const auth = getAuth(app)
    return await auth.getUser(uid)
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

// Verify admin role with token
export async function verifyAdminToken(idToken: string): Promise<boolean> {
  const user = await verifyIdToken(idToken)
  if (!user) return false

  // Check role in Supabase
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.uid)
      .single()

    return profile?.role === 'admin'
  } catch (error) {
    console.error('Admin verification error:', error)
    return false
  }
}
