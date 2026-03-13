#!/bin/bash

echo "🔧 Email System Quick Setup"
echo "=========================="

# Copy Gmail config to root .env
if [ ! -f ".env" ]; then
    cp email-system/config/.env.gmail .env
    echo "✅ Created .env file with Gmail configuration"
else
    echo "⚠️ .env file already exists - please update manually"
fi

# Kill existing server
echo "📦 Stopping existing server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start server
echo "🚀 Starting server..."
npm run start:dev &
sleep 5

# Test email system
echo "📧 Testing email system..."
node email-system/scripts/test-email.js

echo ""
echo "🎯 Setup complete!"
echo "📬 Check Gmail inbox for test emails"
