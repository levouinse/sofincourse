import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Terminal, Zap, Code2, Shield, BookOpen, Award, Users } from 'lucide-react'
import { HomeClient } from './HomeClient'

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin 
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return await res.json()
  } catch {
    return { courses: 5, lessons: 8, categories: 3, users: 1 }
  }
}

export default async function Home() {
  const stats = await getStats()

  const statsData = [
    { label: 'COURSES', value: stats.courses, icon: BookOpen, color: 'text-[#9bff00]' },
    { label: 'LESSONS', value: stats.lessons, icon: Terminal, color: 'text-blue-400' },
    { label: 'CATEGORIES', value: stats.categories, icon: Award, color: 'text-purple-400' },
    { label: 'STUDENTS', value: stats.users, icon: Users, color: 'text-orange-400' }
  ]

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid relative overflow-hidden">
      <div className="scan-line" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f14]/50 to-[#0a0f14] pointer-events-none" />
      
      <main className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-block mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-[#9bff00] mb-4">
              <Terminal className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs md:text-sm font-mono">root@sofincourse:~$</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 glow-green-text" style={{ color: '#9bff00' }}>SOFINCOURSE</h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-4 px-4">
            Master <span className="text-[#9bff00] font-semibold">Cybersecurity</span>, <span className="text-[#9bff00] font-semibold">Coding</span> & <span className="text-[#9bff00] font-semibold">Languages</span>
          </p>
          <p className="text-xs md:text-sm text-gray-500 font-mono mb-6 md:mb-8">[ CLEARNET + DARKNET ACCESS ]</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-[#9bff00] hover:bg-[#7acc00] text-black border-0 font-bold glow-green">
                <Zap className="w-4 h-4 md:w-5 md:h-5" />
                START LEARNING
              </Button>
            </Link>
            <Link href="/skill-tree" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 border-[#9bff00] text-[#9bff00] hover:bg-[#9bff00] hover:text-black transition-all">
                <Code2 className="w-4 h-4 md:w-5 md:h-5" />
                SKILL TREE
              </Button>
            </Link>
            <HomeClient />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-20">
          {statsData.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-[#0f1419] border border-[#282d35] p-4 md:p-6 text-center hover:border-[#9bff00] transition-all group">
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>{stat.value}+</div>
                <div className="text-xs md:text-sm text-gray-500 font-mono">{stat.label}</div>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#0f1419] border-[#282d35] hover:border-[#9bff00] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9bff00]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-8 relative z-10">
              <div className="w-12 h-12 bg-[#9bff00]/10 rounded flex items-center justify-center mb-4 group-hover:bg-[#9bff00]/20 transition-all group-hover:scale-110">
                <Shield className="w-6 h-6 text-[#9bff00]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-200">SECURITY FIRST</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Learn cybersecurity, ethical hacking, and secure coding practices from industry experts</p>
              <div className="mt-4 flex items-center gap-2 text-[#9bff00] text-xs font-mono">
                <span className="w-2 h-2 bg-[#9bff00] rounded-full animate-pulse"></span>
                <span>ACTIVE LEARNING</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0f1419] border-[#282d35] hover:border-blue-400 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-8 relative z-10">
              <div className="w-12 h-12 bg-blue-400/10 rounded flex items-center justify-center mb-4 group-hover:bg-blue-400/20 transition-all group-hover:scale-110">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-200">HANDS-ON LABS</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Real-world coding challenges with Python, JavaScript, Linux command line and more</p>
              <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-mono">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span>PRACTICAL SKILLS</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0f1419] border-[#282d35] hover:border-purple-400 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardContent className="p-8 relative z-10">
              <div className="w-12 h-12 bg-purple-400/10 rounded flex items-center justify-center mb-4 group-hover:bg-purple-400/20 transition-all group-hover:scale-110">
                <Code2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-200">DUAL ACCESS</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Access via clearnet with OAuth or darknet (Tor) for anonymous learning</p>
              <div className="mt-4 flex items-center gap-2 text-purple-400 text-xs font-mono">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span>PRIVACY FOCUSED</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block p-8 bg-[#0f1419] border-2 border-[#9bff00] glow-green">
            <p className="text-gray-400 mb-4 font-mono text-sm">&gt; Ready to level up your skills?</p>
            <Link href="/courses">
              <Button className="bg-[#9bff00] hover:bg-[#7acc00] text-black font-bold">BROWSE ALL COURSES →</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
