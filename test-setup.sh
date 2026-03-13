#!/bin/bash

echo "🔍 Testing Backend and WebSocket Setup"
echo "======================================"

# Test 1: Check if backend is running
echo "1. Testing Backend HTTP Connection..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 3000"
else
    echo "❌ Backend is not responding on port 3000"
    echo "Please start the backend with: cd /home/ignek/Dev-dating/dev-dating-backend && npm run start:dev"
    exit 1
fi

# Test 2: Check WebSocket endpoint
echo ""
echo "2. Testing WebSocket Endpoint..."
if curl -s "http://localhost:3000/socket.io/?EIO=4" | grep -q "socket.io" 2>/dev/null; then
    echo "✅ WebSocket endpoint is accessible"
else
    echo "❌ WebSocket endpoint not accessible"
    echo "Check if ChatGateway is properly configured"
fi

# Test 3: Check if we can get a token
echo ""
echo "3. Testing Authentication..."
echo "To get a JWT token, you can:"
echo "   - Login via the web app at http://localhost:3001"
echo "   - Or use curl: curl -X POST http://localhost:3000/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"password\"}'"

echo ""
echo "4. Next Steps:"
echo "   1. Open http://localhost:3001/test-websocket.html"
echo "   2. Get a JWT token from the app"
echo "   3. Test the WebSocket connection"
echo "   4. Then visit http://localhost:3001/messages/5 to test the chat UI"
