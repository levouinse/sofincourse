export const dynamic = 'force-dynamic'

import SkillTreeClient from './SkillTreeClient'
import { Suspense } from 'react'
import { SkillTreeSkeleton } from '@/components/Skeletons'
import { Navbar } from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

async function SkillTreeContent() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('slug, title, description, category, thumbnail_url, order_index')
    .eq('published', true)
    .order('order_index', { ascending: true })

  const coursesData = courses?.map((c: { slug: string; title: string; description: string; category: string; thumbnail_url: string; order_index: number }) => ({
    slug: c.slug,
    title: c.title,
    description: c.description || '',
    category: c.category,
    thumbnail: c.thumbnail_url,
    order: c.order_index
  })) || []

  return <SkillTreeClient courses={coursesData} />
}

function SkillTreeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="h-10 md:h-12 w-48 md:w-64 bg-[#282d35] animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-5 md:h-6 w-64 md:w-96 bg-[#282d35] animate-pulse rounded mx-auto"></div>
        </div>
        <SkillTreeSkeleton />
      </main>
    </div>
  )
}

export default function SkillTreePage() {
  return (
    <Suspense fallback={<SkillTreeLoading />}>
      <SkillTreeContent />
    </Suspense>
  )
}
