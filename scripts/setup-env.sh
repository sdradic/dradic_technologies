#!/bin/bash

# Setup environment variables for the monorepo
echo "Setting up environment variables for Dradic Technologies monorepo..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy example to .env
cp env.example .env

echo "✅ Created .env file from env.example"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Run 'pnpm install' to install dependencies"
echo "3. Run 'pnpm start' to start development servers"
echo ""
echo "🔧 The .env file will be shared across all projects:"
echo "   - blog_cms"
echo "   - dradic_tech" 
echo "   - expense_tracker"
echo "   - unified_backend" 