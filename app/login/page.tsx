'use client'

import { useState } from 'react'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const syncWithSupabase = async (firebaseUser: { uid: string; email: string | null; getIdToken: () => Promise<string> }) => {
    const token = await firebaseUser.getIdToken()
    await supabase.auth.signInWithIdToken({
      provider: 'google',
      token
    })
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let userCredential
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
        alert('Account created! Please verify your email.')
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      }
      
      await syncWithSupabase(userCredential.user)
      router.push('/courses')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await syncWithSupabase(result.user)
      router.push('/courses')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google login failed')
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-[#9bff00] font-mono mb-2 glow-green-text">
              &gt; SOFINCOURSE_
            </h1>
          </Link>
          <p className="text-gray-500 text-sm font-mono">[ SECURE ACCESS PORTAL ]</p>
        </div>

        <Card className="bg-[#0f1419] border-[#9bff00] border-2 glow-green">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#9bff00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#9bff00]">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2 font-mono">
                &gt; {isSignUp ? 'SIGN UP' : 'LOGIN'}_
              </h2>
              <p className="text-gray-400 text-sm">
                Access your learning dashboard
              </p>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded px-4 py-3 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-mono text-gray-400 mb-2">EMAIL</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-4 py-3 text-gray-200 focus:border-[#9bff00] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-mono text-gray-400 mb-2">PASSWORD</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="w-full bg-[#0a0f14] border border-[#282d35] rounded px-4 py-3 text-gray-200 focus:border-[#9bff00] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#9bff00] hover:bg-[#7acc00] text-black border-0 font-bold py-6 text-lg"
              >
                {loading ? 'PROCESSING...' : isSignUp ? 'SIGN UP' : 'LOGIN'}
              </Button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-sm text-gray-400 hover:text-[#9bff00] transition-colors"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#282d35]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0f1419] text-gray-500 font-mono">OR CONTINUE WITH</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                type="button"
                className="w-full bg-white hover:bg-gray-100 text-black border-0 font-semibold py-6 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'CONNECTING...' : 'GOOGLE'}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/courses" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
                Continue as guest (limited access)
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[#282d35]">
              <p className="text-xs text-gray-500 text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
