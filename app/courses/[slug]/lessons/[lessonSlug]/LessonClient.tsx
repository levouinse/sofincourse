'use client'

import Link from 'next/link'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { LoginModal } from '@/components/LoginModal'
import { auth } from '@/lib/firebase'
import { createClient } from '@/lib/supabase/client'
import type { User } from 'firebase/auth'

interface LessonContent {
  slug: string
  title: string
  content: string
  videoUrl?: string
  videoProvider?: string
  pdfUrl?: string
  order: number
  contentType?: 'text' | 'video' | 'pdf' | 'mixed'
}

interface LessonClientProps {
  slug: string
  lessonSlug: string
  lesson: LessonContent
  allLessonsCount: number
  prevLesson: { slug: string; title: string } | null
  nextLesson: { slug: string; title: string } | null
  isLastLesson: boolean
  courseTitle: string
}

export default function LessonClient({
  slug,
  lessonSlug,
  lesson,
  allLessonsCount,
  prevLesson,
  nextLesson,
  isLastLesson,
  courseTitle
}: LessonClientProps) {
  const [showCongrats, setShowCongrats] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser && lesson.order > 1) {
        setShowLoginModal(true)
      }
    })
    return () => unsubscribe()
  }, [lesson.order])

  useEffect(() => {
    const trackProgress = async () => {
      const firebaseUser = auth.currentUser
      if (!firebaseUser && lesson.order > 1) {
        setShowLoginModal(true)
        return
      }
      if (!firebaseUser) return

      try {
        // Track lesson progress
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            courseSlug: slug, 
            lessonSlug, 
            completed: false,
            firebaseUid: firebaseUser.uid
          })
        })

        if (!response.ok) return

        // Only show congratulations if this is the last lesson AND course is now complete
        if (isLastLesson) {
          const completeResponse = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              courseSlug: slug, 
              lessonSlug, 
              completed: true,
              firebaseUid: firebaseUser.uid
            })
          })

          if (completeResponse.ok) {
            const data = await completeResponse.json()
            // Only show if this is a NEW completion
            if (data.newCompletion) {
              setTimeout(() => {
                setShowCongrats(true)
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
                setTimeout(() => {
                  confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } })
                  confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } })
                }, 250)
              }, 500)
            }
          }
        }
      } catch (error) {
        console.error('Progress tracking error:', error)
      }
    }
    trackProgress()
  }, [slug, lessonSlug, isLastLesson, lesson.order])

  if (!user && lesson.order > 1) {
    return (
      <div className="min-h-screen bg-[#0a0f14] cyber-grid flex items-center justify-center">
        {showLoginModal && <LoginModal onClose={() => window.location.href = `/courses/${slug}`} courseName={courseTitle} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={`/courses/${slug}`}>
            <Button variant="ghost" className="text-gray-400 hover:text-[#9bff00] hover:bg-[#9bff00]/10 text-sm md:text-base">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">BACK TO COURSE</span>
              <span className="sm:hidden">BACK</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-5xl font-bold mb-6 md:mb-8 text-gray-200">{lesson.title}</h1>

        <div className="flex gap-2 mb-6">
          {lesson.videoUrl && <span className="px-3 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/30 rounded font-mono">📹 VIDEO</span>}
          {lesson.pdfUrl && <span className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded font-mono">📄 PDF</span>}
          {lesson.content && <span className="px-3 py-1 text-xs bg-[#9bff00]/10 text-[#9bff00] border border-[#9bff00]/30 rounded font-mono">📝 TEXT</span>}
        </div>

        {lesson.videoUrl && (
          <Card className="mb-8 overflow-hidden bg-[#0f1419] border-[#282d35]">
            <div className="bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe src={lesson.videoUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen sandbox="allow-scripts allow-same-origin allow-presentation" />
            </div>
          </Card>
        )}

        {lesson.pdfUrl && (
          <Card className="mb-8 bg-[#0f1419] border-[#282d35]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-200 font-mono">📄 COURSE MATERIAL (PDF)</h3>
                <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9bff00] hover:text-[#7acc00] font-mono">OPEN IN NEW TAB →</a>
              </div>
              <div className="bg-[#0a0f14] border border-[#282d35] rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe src={lesson.pdfUrl} className="w-full h-full" title="PDF Viewer" />
              </div>
            </CardContent>
          </Card>
        )}

        {lesson.content && (
          <Card className="mb-8 bg-[#0f1419] border-[#282d35]">
            <CardContent className="p-8">
              <MarkdownRenderer content={lesson.content} />
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {prevLesson ? (
            <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-[#282d35] text-gray-400 hover:bg-[#9bff00]/10 hover:border-[#9bff00] hover:text-[#9bff00]">
                <ChevronLeft className="w-4 h-4" />
                PREVIOUS
              </Button>
            </Link>
          ) : <div className="hidden sm:block" />}
          
          {nextLesson && (
            <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`} className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-[#9bff00] hover:bg-[#7acc00] text-black border-0 font-bold">
                NEXT
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </main>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} courseName={courseTitle} />}

      {showCongrats && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#0f1419] border-[#9bff00] border-2 max-w-md w-full glow-green">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Trophy className="w-20 h-20 text-[#9bff00] mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-200 mb-2">CONGRATULATIONS! 🎉</h2>
                <p className="text-gray-500">You&apos;ve completed this course!</p>
              </div>
              <div className="space-y-3">
                <Link href="/skill-tree">
                  <Button className="w-full bg-[#9bff00] hover:bg-[#7acc00] text-black border-0 font-bold">VIEW LEARNING PATH</Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" className="w-full border-[#282d35] text-gray-400 hover:bg-[#9bff00]/10 hover:border-[#9bff00] hover:text-[#9bff00]">BROWSE MORE COURSES</Button>
                </Link>
                <Button variant="ghost" onClick={() => setShowCongrats(false)} className="w-full text-gray-500 hover:text-gray-400">CLOSE</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
