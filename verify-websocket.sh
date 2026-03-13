#!/bin/bash

echo "🔍 WebSocket Chat Setup Verification"
echo "===================================="

# Check if backend is accessible
echo "1. Checking Backend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Backend is accessible"
else
    echo "❌ Backend not accessible - please ensure it's running on port 3000"
    exit 1
fi

# Check WebSocket endpoint
echo ""
echo "2. Checking WebSocket Endpoint..."
if curl -s "http://localhost:3000/socket.io/?EIO=4" 2>/dev/null | grep -q "0{"; then
    echo "✅ WebSocket server is running"
else
    echo "❌ WebSocket server not responding"
    echo "The ChatGateway should be initialized when backend starts"
fi

echo ""
echo "3. Instructions to Test Chat:"
echo ""
echo "   Step 1: Get a JWT Token"
echo "   -----------------------"
echo "   - Login to the app at http://localhost:3001/auth/login"
echo "   - After login, open browser console (F12) and run:"
echo "     localStorage.getItem('auth_token')"
echo "   - Copy the token (it's a long string)"
echo ""
echo "   Step 2: Test WebSocket Connection"
echo "   ---------------------------------"
echo "   - Open: http://localhost:3001/test-websocket.html"
echo "   - Paste the JWT token"
echo "   - Click 'Test Connection'"
echo "   - You should see 'Connected successfully!'"
echo ""
echo "   Step 3: Test Real Chat"
echo "   --------------------"
echo "   - Navigate to: http://localhost:3001/messages/5"
echo "   - You should see the chat UI with connection status"
echo "   - Messages should appear in real-time (no refresh needed)"
echo ""
echo "4. Troubleshooting:"
echo "   - If WebSocket test fails: Check browser console for errors"
echo "   - If chat shows 'Disconnected': Backend WebSocket might not be running"
echo "   - If messages don't appear: Check if chat room exists (try room ID 5)"
