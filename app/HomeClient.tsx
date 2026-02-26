'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import { auth } from '@/lib/firebase'

export function HomeClient() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser
      if (user) {
        const response = await fetch(`/api/user-role?uid=${user.uid}`)
        const data = await response.json()
        setIsAdmin(data.role === 'admin')
      }
    }

    auth.onAuthStateChanged(checkAdmin)
  }, [])

  if (!isAdmin) return null

  return (
    <Link href="/dashboard" className="w-full sm:w-auto">
      <Button size="lg" variant="outline" className="w-full text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all">
        <Shield className="w-4 h-4 md:w-5 md:h-5" />
        ADMIN
      </Button>
    </Link>
  )
}
