'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

export function useAdminAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ uid: string; email?: string | null } | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/')
        return
      }

      // Check if admin
      const roleResponse = await fetch(`/api/user-role?uid=${firebaseUser.uid}`)
      const roleData = await roleResponse.json()

      if (roleData.role !== 'admin') {
        router.push('/')
        return
      }
      
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  return { user, loading }
}
