import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function deleteTestUsers() {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .in('email', ['test@example.com', 'newuser@example.com'])
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Test users deleted successfully')
  }
}

deleteTestUsers()
