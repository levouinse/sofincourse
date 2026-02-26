import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function runMigration() {
  console.log('🔄 Running database migration...\n')

  try {
    // Check if firebase_uid column already exists
    console.log('1️⃣ Checking if firebase_uid column exists...')
    const { error: checkError } = await supabase
      .from('users')
      .select('firebase_uid')
      .limit(1)

    if (!checkError) {
      console.log('✅ Column firebase_uid already exists!')
      console.log('\n✨ Migration not needed. Database is up to date.\n')
      return
    }

    if (checkError.code !== '42703') {
      console.error('❌ Unexpected error:', checkError)
      process.exit(1)
    }

    console.log('⚠️  Column firebase_uid does not exist. Running migration...\n')

    // Run migration SQL
    console.log('2️⃣ Adding firebase_uid column...')
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE'
    })

    if (alterError) {
      console.error('❌ Failed to add column:', alterError.message)
      console.log('\n⚠️  Please run migration manually in Supabase SQL Editor:')
      console.log('\nALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE;')
      console.log('CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);')
      console.log('UPDATE users SET firebase_uid = id::text WHERE firebase_uid IS NULL;\n')
      process.exit(1)
    }

    console.log('✅ Column added successfully!')

    // Create index
    console.log('3️⃣ Creating index...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid)'
    })

    if (indexError) {
      console.log('⚠️  Index creation failed (might already exist)')
    } else {
      console.log('✅ Index created successfully!')
    }

    // Update existing users
    console.log('4️⃣ Updating existing users...')
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: "UPDATE users SET firebase_uid = id::text WHERE firebase_uid IS NULL"
    })

    if (updateError) {
      console.log('⚠️  Update failed (might be okay if no existing users)')
    } else {
      console.log('✅ Existing users updated!')
    }

    console.log('\n✨ Migration completed successfully!\n')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n⚠️  Please run migration manually in Supabase SQL Editor.')
    console.log('See: supabase-add-firebase-uid.sql\n')
    process.exit(1)
  }
}

runMigration()
