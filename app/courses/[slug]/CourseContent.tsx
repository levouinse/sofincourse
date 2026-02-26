'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayCircle, Lock, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { createClient } from '@/lib/supabase/client'

interface Course {
  id: string
  slug: string
  title: string
  description: string
  category: string
}

interface Lesson {
  id: string
  slug: string
  title: string
  order_index: number
}

interface CourseContentProps {
  slug: string
  course: Course
  lessons: Lesson[]
}

export function CourseContent({ slug, course, lessons }: CourseContentProps) {
  const [user, setUser] = useState<{ uid: string; email: string | null; displayName?: string | null; photoURL?: string | null } | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        loadProgress(firebaseUser.uid)
      }
    })
    return () => unsubscribe()
  }, [])

  const loadProgress = async (firebaseUid: string) => {
    const supabase = createClient()
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', firebaseUid)
      .maybeSingle()

    if (userError || !user) return

    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!course) return

    const { data: progress } = await supabase
      .from('user_lesson_progress')
      .select('lessons(slug)')
      .eq('user_id', user.id)
      .eq('course_id', course.id)

    const completed = progress?.map(p => {
      const lesson = p.lessons as unknown as { slug: string }
      return lesson.slug
    }) || []
    
    setCompletedLessons(completed)
  }

  const isGuest = !user

  return (
    <>
      <Card className="mb-8 bg-[#0f1419] border-[#282d35]">
        <CardHeader>
          <div className="inline-block px-3 py-1 text-xs font-bold rounded bg-[#9bff00]/10 text-[#9bff00] border border-[#9bff00]/30 mb-4 w-fit font-mono">
            [ {course.category.toUpperCase()} ]
          </div>
          <CardTitle className="text-4xl mb-4 text-gray-200">{course.title}</CardTitle>
          <CardDescription className="text-lg text-gray-500">
            {course.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {isGuest && (
        <Card className="mb-6 bg-[#9bff00]/5 border-[#9bff00]">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">
              🔒 <span className="text-[#9bff00] font-semibold">Guest Mode:</span> You can access the first lesson for free. 
              <Link href="/login" className="text-[#9bff00] hover:text-[#7acc00] underline ml-1">
                Login
              </Link> to unlock all lessons.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#0f1419] border-[#282d35]">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-200">COURSE LESSONS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isLocked = isGuest && idx > 0
            const isCompleted = completedLessons.includes(lesson.slug)
            
            return (
              <Link
                key={lesson.slug}
                href={isLocked ? '/login' : `/courses/${slug}/lessons/${lesson.slug}`}
                className={isLocked ? 'pointer-events-none' : ''}
              >
                <div className={`flex items-center gap-4 p-4 rounded-lg border transition-colors group ${
                  isLocked 
                    ? 'border-[#282d35] opacity-60 cursor-not-allowed' 
                    : isCompleted
                    ? 'border-[#9bff00]/50 bg-[#9bff00]/5 hover:border-[#9bff00] cursor-pointer'
                    : 'border-[#282d35] hover:bg-[#9bff00]/5 hover:border-[#9bff00] cursor-pointer'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                    isLocked 
                      ? 'bg-[#282d35] text-gray-600' 
                      : isCompleted
                      ? 'bg-[#9bff00] text-black'
                      : 'bg-[#9bff00] text-black'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors ${
                      isLocked 
                        ? 'text-gray-500' 
                        : 'text-gray-200 group-hover:text-[#9bff00]'
                    }`}>
                      {lesson.title}
                    </h3>
                  </div>
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-gray-600" />
                  ) : isCompleted ? (
                    <span className="text-xs px-2 py-1 bg-[#9bff00]/20 text-[#9bff00] rounded border border-[#9bff00] font-mono">
                      DONE
                    </span>
                  ) : (
                    <PlayCircle className="w-5 h-5 text-gray-500 group-hover:text-[#9bff00] transition-colors" />
                  )}
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}
