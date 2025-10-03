#!/bin/bash

# Database deployment script for RentPax
# Run this after setting up your database and environment variables

echo "🚀 Setting up RentPax database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set your DATABASE_URL first:"
    echo "export DATABASE_URL='postgresql://username:password@host:port/database'"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "✅ Database setup complete!"
echo ""
echo "Your RentPax app is ready to use!"
echo "🌐 Production URL: https://rentpaxmvpplus-o8nxcjic9-joelhenry2512s-projects.vercel.app"
