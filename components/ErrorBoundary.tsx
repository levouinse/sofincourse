'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f14] cyber-grid flex items-center justify-center p-4">
          <Card className="bg-[#0f1419] border-red-500 border-2 max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-red-500 mb-2 font-mono">
                &gt; ERROR_
              </h1>
              
              <p className="text-gray-400 mb-6">
                Something went wrong. Please try again.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-[#0a0f14] border border-[#282d35] rounded p-4 mb-6 text-left">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white border-0 font-bold"
                >
                  RELOAD PAGE
                </Button>
                
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="w-full border-[#282d35] text-gray-400 hover:bg-[#9bff00]/10 hover:border-[#9bff00] hover:text-[#9bff00]"
                >
                  GO HOME
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
