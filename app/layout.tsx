import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sofincourse.vercel.app'),
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
    url: 'https://sofincourse.vercel.app',
    title: 'SofinCourse - Free Cybersecurity & Coding Courses',
    description: 'Master cybersecurity, coding, and programming with free hands-on courses',
    siteName: 'SofinCourse',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'SofinCourse Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SofinCourse - Free Cybersecurity & Coding Courses',
    description: 'Master cybersecurity, coding, and programming with free hands-on courses',
    images: ['/icon-512.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://sofincourse.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon-192.png" sizes="192x192" />
        
        {/* Meta tags */}
        <meta name="theme-color" content="#0a0f14" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ErrorBoundary>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
