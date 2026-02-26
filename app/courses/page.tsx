import { Navbar } from '@/components/Navbar'
import { Terminal } from 'lucide-react'
import { Suspense } from 'react'
import { CourseCardSkeleton } from '@/components/Skeletons'
import { createBrowserClient } from '@supabase/ssr'
import { CoursesListClient } from './CoursesListClient'

export const dynamic = 'force-dynamic'

async function CoursesList() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return <CoursesListClient courses={[]} />
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseKey)

  const { data: courses } = await supabase
    .from('courses')
    .select('id, slug, title, description, category')
    .eq('published', true)
    .order('order_index', { ascending: true })

  return <CoursesListClient courses={courses || []} />
}

function CoursesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function CoursesPage() {

  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 text-[#9bff00] mb-4 font-mono text-xs md:text-sm">
            <Terminal className="w-4 h-4" />
            <span>root@sofincourse:~/courses$</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-200">
            ALL COURSES
          </h1>
          <p className="text-base md:text-lg text-gray-500">
            Master cybersecurity, coding, and more with hands-on lessons
          </p>
        </div>
        
        <Suspense fallback={<CoursesLoading />}>
          <CoursesList />
        </Suspense>
      </main>
    </div>
  )
}
