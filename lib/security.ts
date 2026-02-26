import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

// Validation schemas
export const courseSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200).trim(),
  description: z.string().max(1000).trim().optional().nullable(),
  category: z.enum(['coding', 'security', 'language']),
  thumbnail_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  order_index: z.number().int().min(0).max(9999),
  published: z.boolean(),
})

export const lessonSchema = z.object({
  course_id: z.string().uuid(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200).trim(),
  content_markdown: z.string().max(100000).optional().nullable(),
  video_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  video_provider: z.enum(['youtube', 'vimeo', 'other']).optional().nullable(),
  pdf_url: z.string().url().max(500).optional().nullable().or(z.literal('')),
  content_type: z.enum(['text', 'video', 'pdf', 'mixed']).optional(),
  order_index: z.number().int().min(0).max(9999),
})

// Sanitize HTML with DOMPurify
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return ''
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'code', 'pre', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  })
}

// Sanitize markdown content
export function sanitizeMarkdown(content: string): string {
  if (!content) return ''
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'code', 'pre', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
  })
}

// Validate UUID
export function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)
}

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number; blocked: boolean }>()

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key)
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs, blocked: false })
    return true
  }

  if (record.blocked) return false

  if (record.count >= maxRequests) {
    record.blocked = true
    return false
  }

  record.count++
  return true
}

// Admin verification - requires Firebase ID token verification
export async function verifyAdminWithToken(idToken: string): Promise<{ valid: boolean; uid?: string }> {
  try {
    // In production, verify Firebase ID token here
    // For now, just decode and check role in Supabase
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${idToken}` }
    })
    
    if (!response.ok) return { valid: false }
    
    const user = await response.json()
    return { valid: true, uid: user.id }
  } catch {
    return { valid: false }
  }
}

