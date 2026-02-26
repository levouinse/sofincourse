import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - SofinCourse',
  description: 'Privacy policy for SofinCourse platform'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f14] cyber-grid">
      <nav className="border-b border-[#282d35] bg-[#0f1419]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#9bff00] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-[#9bff00] font-mono mb-8">&gt; PRIVACY POLICY_</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">1. Information We Collect</h2>
            <p>When you use SofinCourse, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (email, name) when you sign up via Google or GitHub OAuth</li>
              <li>Course progress and completion data</li>
              <li>Usage analytics to improve the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the learning platform</li>
              <li>Track your course progress</li>
              <li>Send important updates about the platform</li>
              <li>Improve our services and user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">3. Data Storage</h2>
            <p>Your data is stored securely using:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Supabase (PostgreSQL) for course and progress data</li>
              <li>Firebase Authentication for secure login</li>
              <li>All data is encrypted in transit and at rest</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google OAuth for authentication</li>
              <li>GitHub OAuth for authentication</li>
              <li>Vercel for hosting</li>
              <li>Supabase for database</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your course progress data</li>
              <li>Opt-out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">6. Cookies</h2>
            <p>We use essential cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and session management</li>
              <li>Remembering your preferences</li>
              <li>Analytics (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">7. Contact</h2>
            <p>For privacy concerns, contact us at: <a href="mailto:kofikampoes@gmail.com" className="text-[#9bff00] hover:underline">kofikampoes@gmail.com</a></p>
          </section>

          <section>
            <p className="text-sm text-gray-500 mt-8">Last updated: February 26, 2026</p>
          </section>
        </div>
      </main>
    </div>
  )
}
