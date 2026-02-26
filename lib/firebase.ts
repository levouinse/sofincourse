import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { env } from './env'

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY.trim(),
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.trim(),
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.trim(),
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.trim(),
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.trim(),
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID.trim(),
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()
