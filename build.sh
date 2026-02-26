#!/bin/bash
set -e

echo "🔧 SofinCourse Build Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
else
  echo "✅ Dependencies already installed"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "⚠️  Warning: .env.local not found"
  echo "📝 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please edit .env.local with your actual credentials"
  echo ""
  echo "For build without env vars, set: SKIP_ENV_VALIDATION=true"
  exit 1
fi

echo "🏗️  Building Next.js application..."
npm run build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "To build Docker image:"
echo "  docker build -t sofincourse ."
echo "  docker run -p 3000:3000 --env-file .env.local sofincourse"
