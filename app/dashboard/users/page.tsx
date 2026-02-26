'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Shield, User } from 'lucide-react'

interface UserData {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: string
  created_at: string
}

export default function UsersManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUsers = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const token = await user.getIdToken()
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          console.error('Failed to load users:', response.status)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        setUsers(data.users || [])
        setLoading(false)
      } catch (error) {
        console.error('Error loading users:', error)
        setLoading(false)
      }
    }

    auth.onAuthStateChanged(loadUsers)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f14] cyber-grid">
        <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4"><div className="h-8 w-56 bg-[#282d35] animate-pulse rounded"></div></div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-[#282d35] animate-pulse rounded mb-6"></div>
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-[#0f1419] border border-[#282d35] rounded-lg p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-[#282d35] animate-pulse rounded-full"></div><div className="flex-1"><div className="h-5 w-48 bg-[#282d35] animate-pulse rounded mb-2"></div><div className="h-4 w-64 bg-[#282d35] animate-pulse rounded"></div></div></div></div>)}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9bff00] font-mono">&gt; USERS MANAGEMENT_</h1>
          <Link href="/dashboard"><Button variant="ghost" className="text-gray-400 hover:text-[#9bff00]"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-200 mb-6">Recent Users ({users.length})</h2>

        <div className="grid gap-4">
          {users.map(user => (
            <Card key={user.id} className="bg-[#0f1419] border-[#282d35] hover:border-purple-400 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full border-2 border-[#282d35]" />
                    ) : (
                      <div className="w-12 h-12 bg-purple-400/10 rounded-full flex items-center justify-center border-2 border-[#282d35]">
                        <User className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-200">{user.name || user.email}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-600 font-mono mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs rounded font-mono flex items-center gap-2 ${
                      user.role === 'admin'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3" />}
                      {user.role?.toUpperCase() || 'USER'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
