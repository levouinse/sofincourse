import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content/courses')

export interface CourseMeta {
  slug: string
  title: string
  description: string
  category: string
  thumbnail?: string
  order: number
}

export interface LessonContent {
  slug: string
  title: string
  content: string
  videoUrl?: string
  videoProvider?: string
  pdfUrl?: string
  order: number
  contentType?: 'text' | 'video' | 'pdf' | 'mixed'
}

// Validate path to prevent directory traversal
function isValidSlug(slug: string): boolean {
  if (!slug) return false
  return /^[a-z0-9-]+$/.test(slug) && !slug.includes('..')
}

export function getAllCourses(): CourseMeta[] {
  if (!fs.existsSync(contentDir)) return []
  
  const courses = fs.readdirSync(contentDir)
  return courses
    .filter(slug => isValidSlug(slug))
    .map(slug => {
      const metaPath = path.join(contentDir, slug, 'meta.json')
      if (!fs.existsSync(metaPath)) return null
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
        return { ...meta, slug }
      } catch {
        return null
      }
    })
    .filter(Boolean) as CourseMeta[]
}

export function getCourseBySlug(slug: string): CourseMeta | null {
  if (!isValidSlug(slug)) return null
  
  const metaPath = path.join(contentDir, slug, 'meta.json')
  if (!fs.existsSync(metaPath)) return null
  
  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
    return { ...meta, slug }
  } catch {
    return null
  }
}

export function getLessonsBySlug(courseSlug: string): LessonContent[] {
  if (!isValidSlug(courseSlug)) return []
  
  const lessonsDir = path.join(contentDir, courseSlug, 'lessons')
  if (!fs.existsSync(lessonsDir)) return []
  
  const lessons = fs.readdirSync(lessonsDir)
  return lessons
    .filter(file => file.endsWith('.md') && isValidSlug(file.replace('.md', '')))
    .map(file => {
      const slug = file.replace('.md', '')
      try {
        const content = fs.readFileSync(path.join(lessonsDir, file), 'utf-8')
        const { data, content: markdown } = matter(content)
        return {
          slug,
          title: data.title,
          content: markdown,
          videoUrl: data.videoUrl,
          videoProvider: data.videoProvider,
          pdfUrl: data.pdfUrl,
          contentType: data.contentType || 'text',
          order: data.order || 0,
        }
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => a!.order - b!.order) as LessonContent[]
}

export function getLesson(courseSlug: string, lessonSlug: string): LessonContent | null {
  if (!isValidSlug(courseSlug) || !isValidSlug(lessonSlug)) return null
  
  const lessonPath = path.join(contentDir, courseSlug, 'lessons', `${lessonSlug}.md`)
  if (!fs.existsSync(lessonPath)) return null
  
  try {
    const content = fs.readFileSync(lessonPath, 'utf-8')
    const { data, content: markdown } = matter(content)
    return {
      slug: lessonSlug,
      title: data.title,
      content: markdown,
      videoUrl: data.videoUrl,
      videoProvider: data.videoProvider,
      pdfUrl: data.pdfUrl,
      contentType: data.contentType || 'text',
      order: data.order || 0,
    }
  } catch {
    return null
  }
}
