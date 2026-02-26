import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

function validateEnv() {
  // Skip validation during build or if explicitly disabled
  if (process.env.SKIP_ENV_VALIDATION === 'true' || process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return {
      NEXT_PUBLIC_FIREBASE_API_KEY: 'placeholder',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'placeholder.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'placeholder',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'placeholder.appspot.com',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'placeholder',
      NEXT_PUBLIC_FIREBASE_APP_ID: 'placeholder',
      NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder',
    }
  }

  try {
    return envSchema.parse({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim(),
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('⚠️ Environment validation failed:', error.issues.map(i => i.path.join('.')).join(', '))
    }
    throw error
  }
}

export const env = validateEnv()
