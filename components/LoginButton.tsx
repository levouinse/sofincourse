'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function AuthButton() {
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName?: string | null; photoURL?: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user to Supabase
        try {
          await fetch('/api/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            })
          })
        } catch (error) {
          console.error('Failed to sync user:', error)
        }
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <Button variant="ghost" disabled className="text-gray-400 min-h-[44px]" aria-label="Loading authentication status">Loading...</Button>
  }

  if (user) {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href="/profile" aria-label={`View profile for ${user.displayName || user.email}`}>
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.photoURL} 
                alt={`Profile picture of ${user.displayName || user.email}`} 
                className="w-10 h-10 rounded-full border-2 border-[#282d35] hover:border-[#9bff00] transition-colors cursor-pointer" 
                loading="lazy"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#9bff00]/10 border-2 border-[#282d35] hover:border-[#9bff00] transition-colors cursor-pointer flex items-center justify-center" aria-label={`Profile for ${user.email}`}>
                <span className="text-xs text-[#9bff00] font-bold">{user.email?.[0].toUpperCase()}</span>
              </div>
            )}
          </Link>
          <span className="text-sm font-medium text-gray-200 truncate flex-1">{user.displayName || user.email}</span>
        </div>
        <Button 
          onClick={handleLogout} 
          className="w-full md:w-auto bg-[#0a0f14] hover:bg-red-500/10 text-gray-300 hover:text-red-500 border border-[#282d35] hover:border-red-500 transition-all font-mono min-h-[44px]"
          aria-label="Logout from account"
        >
          <LogOut className="w-4 h-4 mr-1" aria-hidden="true" />
          LOGOUT
        </Button>
      </div>
    )
  }

  return (
    <Link href="/login" className="w-full md:w-auto">
      <Button className="w-full md:w-auto bg-[#9bff00] hover:bg-[#7acc00] text-black border-0 font-bold min-h-[44px]" aria-label="Login to your account">
        LOGIN
      </Button>
    </Link>
  )
}
