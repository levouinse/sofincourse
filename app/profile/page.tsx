'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Mail, Calendar, Award, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/firebase'

export default function ProfilePage() {
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; metadata?: { creationTime?: string } } | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ completed: 0, inProgress: 0 })
  const [role, setRole] = useState<string>('user')
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login')
        return
      }

      setUser(firebaseUser)

      // Load user stats and role from Supabase
      try {
        const response = await fetch(`/api/progress?uid=${firebaseUser.uid}`)
        const data = await response.json()
        setStats(data.stats || { completed: 0, inProgress: 0 })
        
        // Get user role
        const roleResponse = await fetch(`/api/user-role?uid=${firebaseUser.uid}`)
        const roleData = await roleResponse.json()
        setRole(roleData.role || 'user')
      } catch (error) {
        console.error('Error loading stats:', error)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f14] cyber-grid">
        <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="h-8 w-32 bg-[#282d35] animate-pulse rounded"></div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
            <div className="h-64 bg-[#0f1419] border border-[#282d35] rounded-lg animate-pulse"></div>
            <div className="h-48 bg-[#0f1419] border border-[#282d35] rounded-lg animate-pulse"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50" aria-label="Profile navigation">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/courses">
            <Button variant="ghost" className="text-gray-300 hover:text-[#9bff00] hover:bg-[#9bff00]/10 min-h-[44px]" aria-label="Back to courses">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              BACK
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-200 mb-2 font-mono">&gt; USER PROFILE_</h1>
          <p className="text-gray-400">Manage your account and track your progress</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-[#0f1419] border-[#282d35]">
            <CardHeader>
              <CardTitle className="text-gray-200 font-mono">ACCOUNT INFORMATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#9bff00]/10 border-2 border-[#9bff00] flex items-center justify-center" aria-hidden="true">
                  <User className="w-10 h-10 text-[#9bff00]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-200">{user?.displayName || 'User'}</h2>
                  <p className="text-gray-400 text-sm font-mono">Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="grid gap-3 pt-4 border-t border-[#282d35]">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-[#9bff00]" aria-hidden="true" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-[#9bff00]" aria-hidden="true" />
                  <span>Joined {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#9bff00]" aria-hidden="true" />
                  <span className="text-gray-300">Role:</span>
                  {role === 'admin' ? (
                    <span className="px-3 py-1 text-xs bg-[#9bff00] text-black rounded font-bold font-mono" role="status">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-[#282d35] text-gray-300 rounded font-mono" role="status">
                      USER
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1419] border-[#282d35]">
            <CardHeader>
              <CardTitle className="text-gray-200 font-mono">LEARNING STATISTICS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0f14] border border-[#282d35] rounded-lg p-6 text-center" role="group" aria-label={`${stats.completed} courses completed`}>
                  <Award className="w-8 h-8 text-[#9bff00] mx-auto mb-2" aria-hidden="true" />
                  <div className="text-3xl font-bold text-[#9bff00] mb-1">{stats.completed}</div>
                  <div className="text-sm text-gray-400 font-mono">COMPLETED</div>
                </div>
                <div className="bg-[#0a0f14] border border-[#282d35] rounded-lg p-6 text-center" role="group" aria-label={`${stats.inProgress} courses in progress`}>
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" aria-hidden="true" />
                  <div className="text-3xl font-bold text-gray-300 mb-1">{stats.inProgress}</div>
                  <div className="text-sm text-gray-400 font-mono">IN PROGRESS</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1419] border-[#282d35]">
            <CardHeader>
              <CardTitle className="text-gray-200 font-mono">QUICK ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/courses">
                <Button className="w-full bg-[#9bff00] hover:bg-[#7acc00] text-black font-bold min-h-[48px]" aria-label="Browse all courses">
                  BROWSE COURSES
                </Button>
              </Link>
              <Link href="/skill-tree">
                <Button variant="outline" className="w-full border-[#282d35] text-gray-300 hover:bg-[#9bff00]/10 hover:border-[#9bff00] hover:text-[#9bff00] min-h-[48px]" aria-label="View skill tree">
                  VIEW SKILL TREE
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
