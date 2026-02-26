import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service - SofinCourse',
  description: 'Terms of service for SofinCourse platform'
}

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-[#9bff00] font-mono mb-8">&gt; TERMS OF SERVICE_</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using SofinCourse, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">2. Use of Service</h2>
            <p>SofinCourse provides free educational content on cybersecurity, coding, and languages. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for lawful educational purposes only</li>
              <li>Not attempt to hack, disrupt, or abuse the service</li>
              <li>Not share your account credentials with others</li>
              <li>Not scrape or download content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">3. User Accounts</h2>
            <p>To access full features, you must create an account using Google or GitHub OAuth. You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the security of your account</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">4. Content Ownership</h2>
            <p>All course content, including text, videos, and materials, are owned by SofinCourse or licensed to us. You may:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and view content for personal learning</li>
              <li>Not redistribute, sell, or republish our content</li>
              <li>Not use content for commercial purposes without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">5. Disclaimer</h2>
            <p>SofinCourse is provided "as is" without warranties of any kind. We do not guarantee:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy or completeness of content</li>
              <li>Specific learning outcomes or certifications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">6. Limitation of Liability</h2>
            <p>SofinCourse and its creators shall not be liable for any damages arising from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use or inability to use the service</li>
              <li>Errors or omissions in content</li>
              <li>Unauthorized access to your data</li>
              <li>Any other matter relating to the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">7. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">8. Termination</h2>
            <p>We may terminate or suspend your account at any time for violations of these terms, without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">9. Governing Law</h2>
            <p>These terms are governed by applicable international laws. Any disputes shall be resolved through arbitration.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-200 mb-4">10. Contact</h2>
            <p>For questions about these terms, contact us at: <a href="mailto:kofikampoes@gmail.com" className="text-[#9bff00] hover:underline">kofikampoes@gmail.com</a></p>
          </section>

          <section>
            <p className="text-sm text-gray-500 mt-8">Last updated: February 26, 2026</p>
          </section>
        </div>
      </main>
    </div>
  )
}
