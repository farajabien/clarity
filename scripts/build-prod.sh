#!/bin/bash

# Clarity Production Build Secho "🔨 Building application..."
pnpm run buildipt
# This script prepares the app for production deployment

set -e

echo "🚀 Preparing Clarity for production deployment..."

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_INSTANT_APP_ID" ]; then
    echo "❌ NEXT_PUBLIC_INSTANT_APP_ID environment variable is required"
    exit 1
fi

if [ -z "$INSTANT_APP_ADMIN_TOKEN" ]; then
    echo "❌ INSTANT_APP_ADMIN_TOKEN environment variable is required"
    exit 1
fi

echo "✅ Environment variables configured"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run linting
echo "🔍 Running linting..."
pnpm run lint --fix

# Type checking
echo "🔷 Running type checking..."
pnpm exec tsc --noEmit

# Run tests if they exist
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "🧪 Running tests..."
    pnpm test
fi

# Build the application
echo "🏗️ Building application..."
npm run build

# Check build output
if [ -d ".next" ]; then
    echo "✅ Build successful!"
    echo "📊 Build size analysis:"
    du -sh .next/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Clarity is ready for production deployment!"
echo ""
echo "Next steps:"
echo "1. Deploy to your hosting platform (Vercel recommended)"
echo "2. Configure domain and SSL"
echo "3. Set up monitoring and analytics"
echo "4. Test all features in production environment"
