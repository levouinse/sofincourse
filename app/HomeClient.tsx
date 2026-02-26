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
      <Button size="lg" variant="outline" className="w-full text-base md:text-lg px-8 md:px-10 py-6 md:py-7 border-2 border-[#9bff00] text-[#9bff00] hover:bg-[#9bff00] hover:text-black transition-all min-h-[48px]">
        <Shield className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
        <span>ADMIN</span>
      </Button>
    </Link>
  )
}
