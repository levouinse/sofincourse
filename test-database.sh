#!/bin/bash

# Script untuk test koneksi database dan verifikasi schema

echo "🔍 Testing Database Connection and Schema..."
echo ""

# Load environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

echo "📊 Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Test 1: Check if firebase_uid column exists
echo "1️⃣ Checking if firebase_uid column exists..."
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/users?select=firebase_uid&limit=1" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" | jq '.'

echo ""
echo "2️⃣ Testing /api/admin/courses endpoint..."
curl -s "https://sofincourse.vercel.app/api/admin/courses" | jq '.'

echo ""
echo "3️⃣ Testing /api/sync-user endpoint..."
curl -s "https://sofincourse.vercel.app/api/sync-user" | jq '.'

echo ""
echo "✅ Tests completed!"
