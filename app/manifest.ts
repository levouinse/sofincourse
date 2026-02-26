import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SofinCourse - Free Cybersecurity & Coding Courses',
    short_name: 'SofinCourse',
    description: 'Master cybersecurity, coding, and programming with free hands-on courses',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f14',
    theme_color: '#9bff00',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
