#!/bin/bash

# Test script untuk memverifikasi API endpoints

echo "🧪 Testing SofinCourse API Endpoints..."
echo ""

BASE_URL="https://sofincourse.vercel.app"

# Test 1: GET /api/sync-user
echo "1️⃣ Testing GET /api/sync-user..."
curl -s "$BASE_URL/api/sync-user" | jq '.'
echo ""

# Test 2: GET /api/admin/courses
echo "2️⃣ Testing GET /api/admin/courses..."
curl -s "$BASE_URL/api/admin/courses" | jq '.courses | length'
echo ""

# Test 3: GET /api/stats
echo "3️⃣ Testing GET /api/stats..."
curl -s "$BASE_URL/api/stats" | jq '.'
echo ""

echo "✅ Tests completed!"
