'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      {user.user_metadata.avatar_url && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full" />
        </>
      )}
      <span className="text-sm">{user.user_metadata.name || user.email}</span>
      <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
        Logout
      </button>
    </div>
  )
}
