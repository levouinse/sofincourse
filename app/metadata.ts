import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://sofincourse.com'),
  title: {
    default: 'SofinCourse - Free Cybersecurity & Coding Courses',
    template: '%s | SofinCourse'
  },
  description: 'Master cybersecurity, coding, and programming with free hands-on courses. Learn ethical hacking, web security, Python, JavaScript, and more.',
  keywords: ['cybersecurity', 'coding', 'programming', 'ethical hacking', 'web security', 'python', 'javascript', 'free courses', 'online learning'],
  authors: [{ name: 'SofinCourse' }],
  creator: 'SofinCourse',
  publisher: 'SofinCourse',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sofincourse.com',
    title: 'SofinCourse - Free Cybersecurity & Coding Courses',
    description: 'Master cybersecurity, coding, and programming with free hands-on courses',
    siteName: 'SofinCourse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SofinCourse - Free Cybersecurity & Coding Courses',
    description: 'Master cybersecurity, coding, and programming with free hands-on courses',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://sofincourse.com',
  },
}
