# Database Migration Instructions

## IMPORTANT: Run these SQL migrations in Supabase SQL Editor

### Step 1: Add firebase_uid column (REQUIRED)
Run this SQL in your Supabase SQL Editor:

```sql
-- Add firebase_uid column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

-- Update existing users to set firebase_uid from id (if needed)
UPDATE users SET firebase_uid = id::text WHERE firebase_uid IS NULL;
```

Or simply run the file:
```bash
# In Supabase SQL Editor, copy and paste content from:
supabase-add-firebase-uid.sql
```

### Step 2: Verify the migration
```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'firebase_uid';

-- Check existing users
SELECT id, email, firebase_uid, role FROM users LIMIT 5;
```

### Step 3: Test the API
After migration, test these endpoints:
- GET /api/sync-user (should return 200)
- POST /api/sync-user (with Firebase user data)
- GET /api/admin/courses (should return courses list)

## Troubleshooting

### If you see "column firebase_uid does not exist" error:
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration SQL above
3. Redeploy your Vercel app

### If you see "Method Not Allowed" on /api/sync-user:
- This is now fixed. The endpoint supports both GET and POST methods.

### If /api/admin/courses returns 500:
- Make sure the firebase_uid migration is complete
- Check Vercel logs for detailed error messages
- Verify environment variables are set correctly
