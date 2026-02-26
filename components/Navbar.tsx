'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthButton } from '@/components/LoginButton'
import { Menu, X, Shield } from 'lucide-react'
import { auth } from '@/lib/firebase'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser
      if (user) {
        try {
          const response = await fetch(`/api/user-role?uid=${user.uid}`)
          const data = await response.json()
          const adminStatus = data.role === 'admin'
          setIsAdmin(adminStatus)
        } catch (error) {
          console.error('Admin check error:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    }

    const unsubscribe = auth.onAuthStateChanged(() => {
      checkAdmin()
    })

    return () => unsubscribe()
  }, [])

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold text-[#9bff00] hover:text-[#7acc00] transition-colors font-mono" aria-label="SofinCourse home">
            &gt; SOFINCOURSE_
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/courses">
              <Button variant="ghost" className="text-gray-300 hover:text-[#9bff00] hover:bg-[#9bff00]/10 min-h-[44px]" aria-label="View courses">
                COURSES
              </Button>
            </Link>
            <Link href="/skill-tree">
              <Button variant="ghost" className="text-gray-300 hover:text-[#9bff00] hover:bg-[#9bff00]/10 min-h-[44px]" aria-label="View skill tree">
                SKILL TREE
              </Button>
            </Link>
            {!loading && isAdmin && (
              <button
                onClick={handleAdminClick}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#9bff00] hover:bg-[#7acc00] text-black font-bold rounded transition-colors cursor-pointer min-h-[44px]"
                aria-label="Go to admin panel"
              >
                <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                ADMIN PANEL
              </button>
            )}
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-[#9bff00] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-[#282d35] pt-4">
            <Link href="/courses" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full text-gray-300 hover:text-[#9bff00] hover:bg-[#9bff00]/10 justify-start min-h-[48px]" aria-label="View courses">
                COURSES
              </Button>
            </Link>
            <Link href="/skill-tree" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full text-gray-300 hover:text-[#9bff00] hover:bg-[#9bff00]/10 justify-start min-h-[48px]" aria-label="View skill tree">
                SKILL TREE
              </Button>
            </Link>
            {!loading && isAdmin && (
              <button
                onClick={(e) => {
                  handleAdminClick(e)
                  setIsOpen(false)
                }}
                className="w-full inline-flex items-center justify-start px-4 py-2 bg-[#9bff00] hover:bg-[#7acc00] text-black font-bold rounded transition-colors min-h-[48px]"
                aria-label="Go to admin panel"
              >
                <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                ADMIN PANEL
              </button>
            )}
            <div className="pt-3 border-t border-[#282d35]">
              <AuthButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
