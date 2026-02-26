import Link from 'next/link'
import { Github, Instagram, Mail, Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#282d35] bg-[#0a0f14] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[#9bff00]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#9bff00] font-mono">&gt; SOFINCOURSE_</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Free cybersecurity and coding courses accessible via clearnet and darknet.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-gray-200 font-semibold mb-4 font-mono text-sm">[ QUICK LINKS ]</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-[#9bff00] transition-colors flex items-center gap-2 min-h-[44px]">
                  <span className="text-[#9bff00]" aria-hidden="true">&gt;</span> All Courses
                </Link>
              </li>
              <li>
                <Link href="/skill-tree" className="text-gray-400 hover:text-[#9bff00] transition-colors flex items-center gap-2 min-h-[44px]">
                  <span className="text-[#9bff00]" aria-hidden="true">&gt;</span> Skill Tree
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-400 hover:text-[#9bff00] transition-colors flex items-center gap-2 min-h-[44px]">
                  <span className="text-[#9bff00]" aria-hidden="true">&gt;</span> Profile
                </Link>
              </li>
            </ul>
          </nav>

          {/* Categories */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4 font-mono text-sm">[ CATEGORIES ]</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-400 flex items-center gap-2">
                <span className="text-[#9bff00]" aria-hidden="true">•</span> Security
              </li>
              <li className="text-gray-400 flex items-center gap-2">
                <span className="text-[#9bff00]" aria-hidden="true">•</span> Coding
              </li>
              <li className="text-gray-400 flex items-center gap-2">
                <span className="text-[#9bff00]" aria-hidden="true">•</span> Languages
              </li>
            </ul>
          </div>

          {/* Social */}
          <nav aria-label="Social media links">
            <h3 className="text-gray-200 font-semibold mb-4 font-mono text-sm">[ CONNECT ]</h3>
            <div className="flex gap-4">
              <a 
                href="https://github.com/levouinse" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border border-[#282d35] rounded bg-[#0f1419] flex items-center justify-center text-gray-400 hover:text-[#9bff00] hover:border-[#9bff00] transition-all"
                aria-label="Visit our GitHub profile"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://instagram.com/sofi.ncos" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 border border-[#282d35] rounded bg-[#0f1419] flex items-center justify-center text-gray-400 hover:text-[#9bff00] hover:border-[#9bff00] transition-all"
                aria-label="Visit our Instagram profile"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="mailto:kofikampoes@gmail.com" 
                className="w-12 h-12 border border-[#282d35] rounded bg-[#0f1419] flex items-center justify-center text-gray-400 hover:text-[#9bff00] hover:border-[#9bff00] transition-all"
                aria-label="Send us an email"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#282d35] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-mono">
            <span className="text-[#9bff00]" aria-hidden="true">&gt;</span> © 2026 SofinCourse. Made with <span className="text-[#9bff00]" aria-label="love">💚</span> for the community.
          </p>
          <nav className="flex gap-6 text-sm font-mono" aria-label="Legal links">
            <Link href="/privacy" className="text-gray-400 hover:text-[#9bff00] transition-colors min-h-[44px] flex items-center">
              [ Privacy ]
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-[#9bff00] transition-colors min-h-[44px] flex items-center">
              [ Terms ]
            </Link>
            <a href="https://github.com/levouinse/sofincourse" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#9bff00] transition-colors min-h-[44px] flex items-center">
              [ Open Source ]
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
