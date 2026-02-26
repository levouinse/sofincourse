'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookOpen, Users, GraduationCap, TrendingUp, ArrowLeft } from 'lucide-react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({ totalCourses: 0, totalLessons: 0, totalUsers: 0, totalCompletions: 0 })
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([])
  const [history, setHistory] = useState<Array<{ courses: number; lessons: number; users: number; completions: number }>>([])
  const router = useRouter()

  const loadData = useCallback(async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const token = await user.getIdToken()
      
      // Add cache control to reduce API calls
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'max-age=30'
        },
        next: { revalidate: 30 }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Stats API error:', response.status, errorText)
        throw new Error(`Failed to fetch stats: ${response.status}`)
      }
      
      const data = await response.json()
      
      setStats({
        totalCourses: data.stats?.totalCourses || 0,
        totalLessons: data.stats?.totalLessons || 0,
        totalUsers: data.stats?.totalUsers || 0,
        totalCompletions: data.stats?.totalCompletions || 0
      })
      setUsers(data.users || [])
      setChartData(data.chartData || [])
      
      setHistory(prev => {
        const newHistory = [...prev, data.stats || { courses: 0, lessons: 0, users: 0, completions: 0 }]
        return newHistory.slice(-10)
      })
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data')
      setLoading(false)
    }
  }, [])

  // Auto-refresh every 5 minutes (reduced frequency to avoid rate limits)
  useEffect(() => {
    if (!isAdmin) return
    
    const interval = setInterval(() => {
      loadData()
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [isAdmin, loadData])

  useEffect(() => {
    if (typeof window === 'undefined') return

    let isMounted = true

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!isMounted) return

      if (!user) {
        router.push('/login')
        return
      }

      try {
        const roleResponse = await fetch(`/api/user-role?uid=${user.uid}`)
        const roleData = await roleResponse.json()

        if (!isMounted) return

        if (roleData.role !== 'admin') {
          router.push('/')
          return
        }

        setIsAdmin(true)
        loadData()
      } catch (error) {
        console.error('📊 Dashboard: Admin check error:', error)
        if (isMounted) {
          setError('Error checking permissions')
          setLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [router, loadData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f14] cyber-grid">
        <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="h-8 w-48 bg-[#282d35] animate-pulse rounded"></div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#0f1419] border border-[#282d35] rounded-lg p-6">
                <div className="h-4 w-20 bg-[#282d35] animate-pulse rounded mb-3"></div>
                <div className="h-8 w-16 bg-[#282d35] animate-pulse rounded"></div>
              </div>
            ))}
          </div>
          {/* Chart Skeleton */}
          <div className="bg-[#0f1419] border border-[#282d35] rounded-lg p-6 mb-8">
            <div className="h-6 w-48 bg-[#282d35] animate-pulse rounded mb-4"></div>
            <div className="h-64 bg-[#282d35] animate-pulse rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <Link href="/">
            <Button className="bg-[#9bff00] hover:bg-[#7acc00] text-black">Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0f14] flex items-center justify-center">
        <div className="text-gray-400">Checking permissions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9bff00] font-mono">&gt; ADMIN DASHBOARD_</h1>
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#9bff00]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#0f1419] border-[#282d35] hover:border-[#9bff00] transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-mono">COURSES</p>
                  <p className="text-3xl font-bold text-[#9bff00]">{stats?.totalCourses || 0}</p>
                </div>
                <BookOpen className="w-12 h-12 text-[#9bff00]/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1419] border-[#282d35] hover:border-blue-400 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-mono">LESSONS</p>
                  <p className="text-3xl font-bold text-blue-400">{stats?.totalLessons || 0}</p>
                </div>
                <GraduationCap className="w-12 h-12 text-blue-400/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1419] border-[#282d35] hover:border-purple-400 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-mono">USERS</p>
                  <p className="text-3xl font-bold text-purple-400">{stats?.totalUsers || 0}</p>
                </div>
                <Users className="w-12 h-12 text-purple-400/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1419] border-[#282d35] hover:border-orange-400 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-mono">COMPLETIONS</p>
                  <p className="text-3xl font-bold text-orange-400">{stats?.totalCompletions || 0}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-400/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="bg-[#0f1419] border-[#282d35] mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-200 font-mono">PLATFORM ACTIVITY (REALTIME)</CardTitle>
              <span className="text-xs text-gray-500 font-mono">Updates every 60s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              {history.length > 1 ? (
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="800" y2="50" stroke="#282d35" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="#282d35" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="800" y2="150" stroke="#282d35" strokeWidth="1" strokeDasharray="5,5" />
                  
                  {/* Generate lines from history data - FROM BOTTOM TO TOP */}
                  {(() => {
                    const maxUsers = Math.max(...history.map(h => h.users), 1)
                    const maxCompletions = Math.max(...history.map(h => h.completions), 1)
                    const maxLessons = Math.max(...history.map(h => h.lessons), 1)
                    const maxCourses = Math.max(...history.map(h => h.courses), 1)
                    
                    const width = 800
                    const height = 200
                    const padding = 20
                    const step = width / (history.length - 1)
                    
                    // Calculate Y position from bottom (height - value)
                    const usersPoints = history.map((h, i) => `${i * step},${height - padding - ((h.users / maxUsers) * (height - padding * 2))}`).join(' ')
                    const completionsPoints = history.map((h, i) => `${i * step},${height - padding - ((h.completions / maxCompletions) * (height - padding * 2))}`).join(' ')
                    const lessonsPoints = history.map((h, i) => `${i * step},${height - padding - ((h.lessons / maxLessons) * (height - padding * 2))}`).join(' ')
                    const coursesPoints = history.map((h, i) => `${i * step},${height - padding - ((h.courses / maxCourses) * (height - padding * 2))}`).join(' ')
                    
                    return (
                      <>
                        {/* Users line */}
                        <polyline points={usersPoints} fill="none" stroke="#a855f7" strokeWidth="3" />
                        {history.map((h, i) => (
                          <circle key={`u${i}`} cx={i * step} cy={height - padding - ((h.users / maxUsers) * (height - padding * 2))} r="5" fill="#a855f7" />
                        ))}
                        
                        {/* Completions line */}
                        <polyline points={completionsPoints} fill="none" stroke="#fb923c" strokeWidth="3" />
                        {history.map((h, i) => (
                          <circle key={`c${i}`} cx={i * step} cy={height - padding - ((h.completions / maxCompletions) * (height - padding * 2))} r="5" fill="#fb923c" />
                        ))}
                        
                        {/* Lessons line */}
                        <polyline points={lessonsPoints} fill="none" stroke="#60a5fa" strokeWidth="3" />
                        {history.map((h, i) => (
                          <circle key={`l${i}`} cx={i * step} cy={height - padding - ((h.lessons / maxLessons) * (height - padding * 2))} r="5" fill="#60a5fa" />
                        ))}
                        
                        {/* Courses line */}
                        <polyline points={coursesPoints} fill="none" stroke="#9bff00" strokeWidth="3" />
                        {history.map((h, i) => (
                          <circle key={`co${i}`} cx={i * step} cy={height - padding - ((h.courses / maxCourses) * (height - padding * 2))} r="5" fill="#9bff00" />
                        ))}
                      </>
                    )
                  })()}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Collecting data...
                </div>
              )}
              
              {/* Legend */}
              <div className="flex gap-6 mt-4 justify-center flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9bff00]"></div>
                  <span className="text-sm text-gray-400 font-mono">Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm text-gray-400 font-mono">Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-gray-400 font-mono">Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-sm text-gray-400 font-mono">Completions</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/courses">
            <Card className="bg-[#0f1419] border-[#9bff00] hover:bg-[#9bff00]/5 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#9bff00] rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-200">Manage Courses</h3>
                    <p className="text-sm text-gray-500">Create, edit, delete courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/users">
            <Card className="bg-[#0f1419] border-purple-400 hover:bg-purple-400/5 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-200">Manage Users</h3>
                    <p className="text-sm text-gray-500">View users and roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card className="bg-[#0f1419] border-blue-400 hover:bg-blue-400/5 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-200">Analytics</h3>
                    <p className="text-sm text-gray-500">Detailed statistics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Coming Soon */}
        <Card className="bg-[#0f1419] border-[#282d35]">
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-200 mb-4 font-mono">&gt; MORE FEATURES COMING SOON_</h3>
            <p className="text-gray-500">Course management, user management, and analytics dashboard</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
