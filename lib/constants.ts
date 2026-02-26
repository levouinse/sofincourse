// Default stats fallback values
export const DEFAULT_STATS = {
  courses: 5,
  lessons: 15,
  categories: 3,
  users: 0, // Changed from 127 to 0 for real count
} as const

// Rate limiting defaults
export const RATE_LIMITS = {
  COURSE_CREATE: { maxRequests: 5, windowMs: 60000 },
  COURSE_UPDATE: { maxRequests: 10, windowMs: 60000 },
  COURSE_DELETE: { maxRequests: 5, windowMs: 60000 },
  LESSON_CREATE: { maxRequests: 10, windowMs: 60000 },
  LESSON_UPDATE: { maxRequests: 20, windowMs: 60000 },
  LESSON_DELETE: { maxRequests: 10, windowMs: 60000 },
  API_DEFAULT: { maxRequests: 10, windowMs: 60000 },
} as const

// Validation patterns
export const VALIDATION_PATTERNS = {
  SLUG: /^[a-z0-9-]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const

// Content limits
export const CONTENT_LIMITS = {
  COURSE_TITLE_MAX: 200,
  COURSE_DESCRIPTION_MAX: 1000,
  LESSON_TITLE_MAX: 200,
  LESSON_CONTENT_MAX: 50000,
  URL_MAX: 500,
} as const
