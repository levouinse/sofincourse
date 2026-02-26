import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkAdminAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/')
  }
  
  return user
}
