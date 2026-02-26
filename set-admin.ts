import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function setAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Usage: npx tsx set-admin.ts <email>')
    process.exit(1)
  }

  console.log(`🔍 Looking for user with email: ${email}`)

  // Find user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    console.error('❌ User not found. Make sure the user has logged in at least once.')
    console.error('Error:', error)
    process.exit(1)
  }

  console.log(`✅ Found user: ${user.name || user.email} (${user.id})`)

  // Update role to admin
  const { error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', user.id)

  if (updateError) {
    console.error('❌ Failed to update user role:', updateError)
    process.exit(1)
  }

  console.log(`🎉 Successfully set ${email} as admin!`)
}

setAdmin().catch(console.error)
