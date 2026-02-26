'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'

interface LoginModalProps {
  onClose: () => void
  courseName: string
}

export function LoginModal({ onClose, courseName }: LoginModalProps) {
  const handleClose = () => {
    onClose()
  }

  const handleContinueAsGuest = () => {
    // Redirect to courses page instead of closing
    window.location.href = '/courses'
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="bg-[#0f1419] border-[#9bff00] border-2 max-w-md w-full glow-green relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#9bff00] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#9bff00]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#9bff00]">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-200 mb-2 font-mono">
              &gt; LOGIN REQUIRED_
            </h2>
            <p className="text-gray-400 text-sm">
              This lesson is locked. Login to continue learning <span className="text-[#9bff00] font-semibold">{courseName}</span>
            </p>
          </div>

          <div className="bg-[#0a0f14] border border-[#282d35] rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              To access all lessons and track your progress, please sign in with your account.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/login">
              <Button className="w-full bg-[#9bff00] hover:bg-[#7acc00] text-black border-0 font-bold py-6 text-lg">
                GO TO LOGIN
              </Button>
            </Link>

            <button
              onClick={handleContinueAsGuest}
              className="w-full text-sm text-gray-500 hover:text-gray-400 transition-colors py-2"
            >
              ← Back to courses
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#282d35]">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
