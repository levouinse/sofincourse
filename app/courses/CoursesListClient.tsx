'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Shield, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  category: string
}

export function CoursesListClient({ courses }: { courses: Course[] }) {
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCompletions = async () => {
      setLoading(true)
      const firebaseUser = auth.currentUser
      if (!firebaseUser) {
        setLoading(false)
        return
      }

      // Use API endpoint instead of direct query
      try {
        const response = await fetch(`/api/progress?uid=${firebaseUser.uid}`)
        const data = await response.json()
        
        if (data.completedCourses) {
          setCompletedCourses(new Set(data.completedCourses))
        }
      } catch (error) {
        console.error('Error loading completions:', error)
      }
      
      setLoading(false)
    }

    loadCompletions()
    
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      loadCompletions()
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => {
        const isCompleted = completedCourses.has(course.slug)
        
        return (
          <Link key={course.slug} href={`/courses/${course.slug}`} aria-label={`View ${course.title} course`}>
            <Card className={`h-full bg-[#0f1419] border-[#282d35] hover:border-[#9bff00] transition-all cursor-pointer group relative ${isCompleted ? 'border-[#9bff00]/50' : ''}`}>
              {!loading && isCompleted && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 px-2 py-1 bg-[#9bff00] text-black rounded text-xs font-bold" role="status" aria-label="Course completed">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    COMPLETED
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="w-full h-40 bg-gradient-to-br from-[#9bff00]/20 to-[#9bff00]/5 rounded-lg mb-4 flex items-center justify-center group-hover:from-[#9bff00]/30 group-hover:to-[#9bff00]/10 transition-all relative" aria-hidden="true">
                  {course.category === 'security' ? (
                    <Shield className="w-16 h-16 text-[#9bff00]" />
                  ) : (
                    <BookOpen className="w-16 h-16 text-[#9bff00]" />
                  )}
                </div>
                <div className="inline-block px-3 py-1 text-xs font-bold rounded bg-[#9bff00]/10 text-[#9bff00] border border-[#9bff00]/30 mb-2 w-fit font-mono">
                  [ {course.category.toUpperCase()} ]
                </div>
                <CardTitle className="text-xl text-gray-200 group-hover:text-[#9bff00] transition-colors">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-400">
                  {course.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
