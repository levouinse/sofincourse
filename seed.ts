import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { getAllCourses, getLessonsBySlug } from './lib/content'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // Get all courses from markdown files
    const courses = getAllCourses()
    console.log(`📚 Found ${courses.length} courses`)

    for (const course of courses) {
      console.log(`\n📖 Processing course: ${course.title}`)

      // Insert course
      const { data: insertedCourse, error: courseError } = await supabase
        .from('courses')
        .upsert({
          slug: course.slug,
          title: course.title,
          description: course.description,
          category: course.category,
          thumbnail_url: course.thumbnail || null,
          order_index: course.order,
          published: true
        }, {
          onConflict: 'slug'
        })
        .select('id')
        .single()

      if (courseError) {
        console.error(`❌ Error inserting course ${course.slug}:`, courseError)
        continue
      }

      console.log(`✅ Course inserted: ${course.title}`)

      // Get lessons for this course
      const lessons = getLessonsBySlug(course.slug)
      console.log(`   📝 Found ${lessons.length} lessons`)

      for (const lesson of lessons) {
        const { error: lessonError } = await supabase
          .from('lessons')
          .upsert({
            course_id: insertedCourse.id,
            slug: lesson.slug,
            title: lesson.title,
            content_markdown: lesson.content || null,
            video_url: lesson.videoUrl || null,
            video_provider: lesson.videoProvider || null,
            pdf_url: lesson.pdfUrl || null,
            content_type: lesson.contentType || 'text',
            order_index: lesson.order
          }, {
            onConflict: 'course_id,slug'
          })

        if (lessonError) {
          console.error(`   ❌ Error inserting lesson ${lesson.slug}:`, lessonError)
        } else {
          console.log(`   ✅ Lesson inserted: ${lesson.title}`)
        }
      }
    }

    console.log('\n🎉 Database seed completed!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

seedDatabase()
