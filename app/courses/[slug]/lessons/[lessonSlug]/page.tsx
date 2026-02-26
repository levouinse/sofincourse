import { createClient } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import LessonClient from './LessonClient'
import { Suspense } from 'react'
import { ContentSkeleton } from '@/components/Skeletons'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function LessonContent({ slug, lessonSlug }: { slug: string; lessonSlug: string }) {
  const supabase = createClient()
  
  const { data: course } = await supabase
    .from('courses')
    .select('id, slug, title')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!course) notFound()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, slug, title, content_markdown, video_url, video_provider, pdf_url, content_type, order_index')
    .eq('course_id', course.id)
    .eq('slug', lessonSlug)
    .single()

  if (!lesson) notFound()

  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, slug, title, order_index')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  const currentIdx = allLessons?.findIndex(l => l.slug === lessonSlug) ?? -1
  const prevLesson = currentIdx > 0 && allLessons ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < (allLessons?.length ?? 0) - 1 && allLessons ? allLessons[currentIdx + 1] : null
  const isLastLesson = currentIdx === (allLessons?.length ?? 0) - 1

  return (
    <LessonClient
      slug={slug}
      lessonSlug={lessonSlug}
      lesson={{
        slug: lesson.slug,
        title: lesson.title,
        content: lesson.content_markdown || '',
        videoUrl: lesson.video_url,
        videoProvider: lesson.video_provider,
        pdfUrl: lesson.pdf_url,
        contentType: lesson.content_type,
        order: lesson.order_index
      }}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      isLastLesson={isLastLesson}
      courseTitle={course.title}
    />
  )
}

function LessonLoading({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={`/courses/${slug}`}>
            <Button variant="ghost" className="text-gray-400 hover:text-[#9bff00] hover:bg-[#9bff00]/10">
              <ArrowLeft className="w-4 h-4" />
              BACK TO COURSE
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <ContentSkeleton />
      </main>
    </div>
  )
}

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = await params
  
  if (!/^[a-z0-9-]+$/.test(slug) || !/^[a-z0-9-]+$/.test(lessonSlug)) {
    notFound()
  }

  return (
    <Suspense fallback={<LessonLoading slug={slug} />}>
      <LessonContent slug={slug} lessonSlug={lessonSlug} />
    </Suspense>
  )
}
