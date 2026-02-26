import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDB() {
  console.log('🔍 Checking Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  
  // Check courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
  
  console.log('\n📚 COURSES:')
  if (coursesError) {
    console.error('❌ Error:', coursesError)
  } else {
    console.log(`✅ Found ${courses?.length || 0} courses`)
    courses?.forEach(c => console.log(`  - ${c.title} (${c.slug})`))
  }
  
  // Check lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
  
  console.log('\n📄 LESSONS:')
  if (lessonsError) {
    console.error('❌ Error:', lessonsError)
  } else {
    console.log(`✅ Found ${lessons?.length || 0} lessons`)
  }
  
  // Check users
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
  
  console.log('\n👤 USERS:')
  if (usersError) {
    console.error('❌ Error:', usersError)
  } else {
    console.log(`✅ Found ${users?.length || 0} users`)
    users?.forEach(u => console.log(`  - ${u.email} (role: ${u.role})`))
  }
}

checkDB().catch(console.error)
