'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { CourseMeta } from '@/lib/content'
import { Navbar } from '@/components/Navbar'
import { auth } from '@/lib/firebase'

export default function SkillTreeClient({ courses }: { courses: CourseMeta[] }) {
  const [completedCourses, setCompletedCourses] = useState<string[]>([])

  useEffect(() => {
    let mounted = true

    const loadProgress = async () => {
      const firebaseUser = auth.currentUser
      if (!firebaseUser) {
        setLoading(false)
        return
      }

      try {
        // Single API call instead of multiple DB queries
        const response = await fetch(`/api/progress?uid=${firebaseUser.uid}`, {
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        if (!response.ok) {
          setLoading(false)
          return
        }
        
        const data = await response.json()
        
        if (mounted && data.completedCourses) {
          setCompletedCourses(data.completedCourses)
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // Load on mount
    loadProgress()
    
    // Listen to auth changes (debounced)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) loadProgress()
      else if (mounted) {
        setCompletedCourses([])
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const isCourseUnlocked = (courseOrder: number) => {
    if (courseOrder === 1) return true
    const previousCourse = courses.find(c => c.order === courseOrder - 1)
    return previousCourse ? completedCourses.includes(previousCourse.slug) : false
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-200">LEARNING PATH</h1>
          <p className="text-base md:text-lg text-gray-500">
            Complete courses in order to unlock the next level
          </p>
        </div>

        <div className="relative">
          {courses.map((course, index) => {
            const isCompleted = completedCourses.includes(course.slug)
            const isUnlocked = isCourseUnlocked(course.order)
            
            return (
              <div key={course.slug} className="mb-8">
                {index > 0 && (
                  <div className="flex justify-center mb-4">
                    <div className={`w-1 h-12 ${isCompleted ? 'bg-[#9bff00]' : 'bg-[#282d35]'}`} />
                  </div>
                )}
                
                <Link 
                  href={isUnlocked ? `/courses/${course.slug}` : '#'}
                  className={!isUnlocked ? 'pointer-events-none' : ''}
                >
                  <Card className={`
                    bg-[#0f1419] border-2 transition-all
                    ${isCompleted ? 'border-[#9bff00] glow-green' : isUnlocked ? 'border-[#9bff00]/50 hover:border-[#9bff00]' : 'border-[#282d35] opacity-60'}
                    ${!isUnlocked && 'cursor-not-allowed'}
                  `}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0
                          ${isCompleted ? 'bg-[#9bff00] text-black' : isUnlocked ? 'bg-[#9bff00]/20 text-[#9bff00] border-2 border-[#9bff00]' : 'bg-[#282d35] text-gray-600'}
                        `}>
                          {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : isUnlocked ? course.order : <Lock className="w-6 h-6" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-200">{course.title}</h3>
                            {isCompleted && (
                              <span className="px-2 py-1 text-xs bg-[#9bff00]/20 text-[#9bff00] rounded border border-[#9bff00] font-mono">
                                COMPLETED
                              </span>
                            )}
                            {!isUnlocked && (
                              <span className="px-2 py-1 text-xs bg-[#282d35] text-gray-500 rounded border border-[#282d35] font-mono">
                                LOCKED
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500">{course.description}</p>
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 bg-[#9bff00]/10 text-[#9bff00] rounded border border-[#9bff00]/30 font-mono">
                              [ {course.category.toUpperCase()} ]
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="mt-12 p-6 bg-[#0f1419] border border-[#282d35] rounded-lg">
          <h3 className="text-lg font-semibold text-gray-200 mb-2 font-mono">&gt; HOW IT WORKS:</h3>
          <ul className="space-y-2 text-gray-500">
            <li>• Complete all lessons in a course to unlock the next one</li>
            <li>• Track your progress through the learning path</li>
            <li>• Build your skills step by step</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
