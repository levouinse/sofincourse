-- Add firebase_uid column to users table
-- Run this in Supabase SQL Editor

ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

-- Update existing users to set firebase_uid from id (if needed)
-- This is a one-time migration for existing users
UPDATE users SET firebase_uid = id::text WHERE firebase_uid IS NULL;
