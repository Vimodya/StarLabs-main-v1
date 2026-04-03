#!/bin/bash
# Production deployment script for Meta H2O ICO Frontend

set -e  # Exit on error

echo "🚀 Deploying frontend..."

# Pull latest changes from git
echo "📥 Pulling latest changes..."
git pull origin main

# Install/update dependencies if package.json changed
if git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the production bundle (this reads .env and compiles values into JS)
echo "🔨 Building production bundle..."
npm run build

# Deploy built files to web server directory
echo "🚀 Deploying to production..."
cp -r dist/* /var/www/metah20.io/

# Verify deployment
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site is live at:"
echo "   • https://metah20.io"
echo "   • https://www.metah20.io"
echo "   • https://ico.metah20.io"
echo ""
echo "📊 Changes are live immediately (no server restart needed)"
