import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

const contentDir = path.join(process.cwd(), 'content/courses')

async function importCourses() {
  console.log('🚀 Starting course import...\n')

  const courseDirs = fs.readdirSync(contentDir)

  for (const courseSlug of courseDirs) {
    const metaPath = path.join(contentDir, courseSlug, 'meta.json')
    if (!fs.existsSync(metaPath)) continue

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    
    console.log(`📚 Importing course: ${meta.title}`)

    // Insert course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .upsert({
        slug: courseSlug,
        title: meta.title,
        description: meta.description,
        category: meta.category,
        thumbnail_url: meta.thumbnail || '',
        order_index: meta.order || 0,
        published: true
      }, { onConflict: 'slug' })
      .select()
      .single()

    if (courseError) {
      console.error(`❌ Error importing course ${courseSlug}:`, courseError)
      continue
    }

    console.log(`✅ Course imported: ${course.id}`)

    // Import lessons
    const lessonsDir = path.join(contentDir, courseSlug, 'lessons')
    if (!fs.existsSync(lessonsDir)) continue

    const lessonFiles = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.md'))

    for (const lessonFile of lessonFiles) {
      const lessonSlug = lessonFile.replace('.md', '')
      const lessonPath = path.join(lessonsDir, lessonFile)
      const fileContent = fs.readFileSync(lessonPath, 'utf-8')
      const { data: frontmatter, content: markdown } = matter(fileContent)

      console.log(`  📄 Importing lesson: ${frontmatter.title}`)

      const { error: lessonError } = await supabase
        .from('lessons')
        .upsert({
          course_id: course.id,
          slug: lessonSlug,
          title: frontmatter.title,
          content_markdown: markdown,
          video_url: frontmatter.videoUrl || null,
          video_provider: frontmatter.videoProvider || null,
          pdf_url: frontmatter.pdfUrl || null,
          content_type: frontmatter.contentType || 'text',
          order_index: frontmatter.order || 0
        }, { onConflict: 'course_id,slug' })

      if (lessonError) {
        console.error(`  ❌ Error importing lesson ${lessonSlug}:`, lessonError)
      } else {
        console.log(`  ✅ Lesson imported: ${lessonSlug}`)
      }
    }

    console.log('')
  }

  console.log('🎉 Import complete!')
}

importCourses().catch(console.error)
