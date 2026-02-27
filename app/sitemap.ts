import { MetadataRoute } from 'next'
import { getAllCoursesWithLessons } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sofincourse.com'
  
  // Fetch all courses with lessons in one go (prevents N+1)
  const coursesWithLessons = getAllCoursesWithLessons()
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skill-tree`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Add course and lesson pages (no N+1 - data already loaded)
  coursesWithLessons.forEach(({ course, lessons }) => {
    routes.push({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })

    // Add lesson pages
    lessons.forEach(lesson => {
      routes.push({
        url: `${baseUrl}/courses/${course.slug}/lessons/${lesson.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    })
  })

  return routes
}
