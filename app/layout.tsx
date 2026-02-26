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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#9bff00" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
