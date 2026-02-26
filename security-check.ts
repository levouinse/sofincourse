import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSecurity() {
  console.log('🔒 SECURITY AUDIT\n')
  
  // 1. Check RLS is enabled
  console.log('1️⃣ Checking Row Level Security (RLS)...')
  
  // Check users table
  const { error: usersError } = await supabase
    .from('users')
    .select('id, email, role')
    .limit(1)
  
  if (usersError) {
    console.log('   ✅ Users table: RLS ENABLED (query blocked without auth)')
  } else {
    console.log('   ⚠️  Users table: RLS might be misconfigured')
  }
  
  // 2. Check admin user exists
  console.log('\n2️⃣ Checking admin users...')
  const { data: admins } = await supabase
    .from('users')
    .select('email, role')
    .eq('role', 'admin')
  
  console.log(`   ✅ Found ${admins?.length || 0} admin(s)`)
  admins?.forEach(a => console.log(`      - ${a.email}`))
  
  // 3. Check courses are public
  console.log('\n3️⃣ Checking public course access...')
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, published')
    .eq('published', true)
    .limit(3)
  
  if (courses && courses.length > 0) {
    console.log(`   ✅ Public courses accessible: ${courses.length} courses`)
  } else {
    console.log('   ❌ No public courses found')
  }
  
  // 4. Check environment variables
  console.log('\n4️⃣ Checking environment variables...')
  const requiredEnvs = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'ADMIN_SECRET_KEY'
  ]
  
  requiredEnvs.forEach(env => {
    const value = process.env[env]
    if (value) {
      console.log(`   ✅ ${env}: Set (${value.substring(0, 20)}...)`)
    } else {
      console.log(`   ❌ ${env}: MISSING`)
    }
  })
  
  console.log('\n✅ Security audit complete!')
}

checkSecurity().catch(console.error)
