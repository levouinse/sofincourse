import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cache } from '@/lib/redis-cache'

function isTorRequest(request: NextRequest): boolean {
  const host = request.headers.get('host')
  const forwarded = request.headers.get('x-forwarded-for')
  
  if (host?.endsWith('.onion')) return true
  if (forwarded?.includes('tor-exit')) return true
  
  return false
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const isTor = isTorRequest(request)
  
  // Block admin routes for Tor users
  if (isTor && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Rate limiting for API routes with Redis (disabled in development)
  if (request.nextUrl.pathname.startsWith('/api/') && process.env.NODE_ENV === 'production') {
    // More lenient limits: 200 req/min for admin (dashboard needs multiple calls), 100 for public
    const limit = request.nextUrl.pathname.startsWith('/api/admin') ? 200 : 100
    const allowed = await cache.rateLimit(`api-${ip}`, limit, 60)
    
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  const response = NextResponse.next()

  // Security headers
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://player.vimeo.com https://www.gstatic.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseio.com",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://*.firebaseapp.com",
    "media-src 'self' https: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ]

  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Connection', 'keep-alive')
  response.headers.set('Keep-Alive', 'timeout=30, max=1000')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))

  // Cache headers for static assets
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
}

