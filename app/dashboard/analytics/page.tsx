'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Analytics() {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
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
          console.error('Failed to load analytics:', response.status)
          setLoading(false)
          return
        }
        
        const data = await response.json()
        setChartData(data.chartData || [])
        setLoading(false)
      } catch (error) {
        console.error('Error loading analytics:', error)
        setLoading(false)
      }
    }

    auth.onAuthStateChanged(loadData)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f14] cyber-grid">
        <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4"><div className="h-8 w-40 bg-[#282d35] animate-pulse rounded"></div></div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-[#0f1419] border border-[#282d35] rounded-lg p-6">
            <div className="h-6 w-48 bg-[#282d35] animate-pulse rounded mb-6"></div>
            <div className="space-y-4">{[1,2,3].map(i => <div key={i}><div className="h-4 w-full bg-[#282d35] animate-pulse rounded mb-2"></div><div className="h-8 bg-[#282d35] animate-pulse rounded"></div></div>)}</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#9bff00] font-mono">&gt; ANALYTICS_</h1>
          <Link href="/dashboard"><Button variant="ghost" className="text-gray-400 hover:text-[#9bff00]"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-[#0f1419] border-[#282d35]">
          <CardHeader>
            <CardTitle className="text-gray-200 font-mono">COURSE COMPLETIONS</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No completion data yet</div>
            ) : (
              <div className="space-y-4">
                {chartData.map((item, index) => {
                  const maxValue = Math.max(...chartData.map(d => d.value), 1)
                  const percentage = (item.value / maxValue) * 100
                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-400">{item.name}</span>
                        <span className="text-sm font-bold text-[#9bff00]">{item.value} completions</span>
                      </div>
                      <div className="w-full bg-[#282d35] rounded-full h-4">
                        <div 
                          className="bg-[#9bff00] h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs text-black font-bold">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
