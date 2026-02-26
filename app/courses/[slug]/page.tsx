export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'
import { LessonSkeleton } from '@/components/Skeletons'
import { CourseContent } from './CourseContent'

async function CourseData({ slug }: { slug: string }) {
  const supabase = createClient()
  
  const { data: course } = await supabase
    .from('courses')
    .select('id, slug, title, description, category')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, slug, title, order_index')
    .eq('course_id', course.id)
    .order('order_index', { ascending: true })

  return <CourseContent slug={slug} course={course} lessons={lessons || []} />
}

function CourseLoading() {
  return (
    <>
      <Card className="mb-8 bg-[#0f1419] border-[#282d35]">
        <CardHeader>
          <div className="h-6 w-24 bg-[#282d35] rounded mb-4 animate-pulse"></div>
          <div className="h-10 w-3/4 bg-[#282d35] rounded mb-4 animate-pulse"></div>
          <div className="h-6 w-full bg-[#282d35] rounded animate-pulse"></div>
        </CardHeader>
      </Card>

      <Card className="bg-[#0f1419] border-[#282d35]">
        <CardHeader>
          <div className="h-8 w-48 bg-[#282d35] rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <LessonSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  if (!/^[a-z0-9-]+$/.test(slug)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/courses">
            <Button variant="ghost" className="text-gray-400 hover:text-[#9bff00] hover:bg-[#9bff00]/10 text-sm md:text-base">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">BACK TO COURSES</span>
              <span className="sm:hidden">BACK</span>
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<CourseLoading />}>
          <CourseData slug={slug} />
        </Suspense>
      </main>
    </div>
  )
}
