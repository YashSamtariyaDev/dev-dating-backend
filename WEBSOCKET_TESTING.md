# WebSocket Testing Guide

## Fixed Issues in ChatGateway

### Problems Fixed:
1. **Missing Authentication**: Added JWT token validation on connection
2. **Missing Error Handling**: Added try-catch blocks and proper error responses
3. **Missing Lifecycle Hooks**: Added connection/disconnection handling
4. **Security Issues**: Added proper CORS configuration
5. **Missing User Context**: Extract userId from JWT and store in client.data
6. **Missing Room Management**: Added join/leave room functionality
7. **Missing Logging**: Added comprehensive console logging

### Key Improvements:
- **Authentication**: Validates JWT token on connection
- **Namespace**: Uses `/chat` namespace
- **Room Management**: Proper join/leave with notifications
- **Error Handling**: Graceful error responses
- **Logging**: Detailed connection and message logs

## WebSocket Events

### Client → Server:
1. **`joinRoom`**: Join a chat room
   ```json
   {
     "chatRoomId": 1
   }
   ```

2. **`sendMessage`**: Send message to room
   ```json
   {
     "chatRoomId": 1,
     "content": "Hello everyone!"
   }
   ```

3. **`leaveRoom`**: Leave a chat room
   ```json
   {
     "chatRoomId": 1
   }
   ```

### Server → Client:
1. **`newMessage`**: New message in room
   ```json
   {
     "id": 1,
     "chatRoomId": 1,
     "senderId": 9,
     "content": "Hello everyone!",
     "createdAt": "2026-03-06T...",
     "senderId": 9,
     "timestamp": "2026-03-06T..."
   }
   ```

2. **`userJoined`**: User joined room
   ```json
   {
     "userId": 9,
     "chatRoomId": 1,
     "message": "User 9 joined the room"
   }
   ```

3. **`userLeft`**: User left room
   ```json
   {
     "userId": 9,
     "chatRoomId": 1,
     "message": "User 9 left the room"
   }
   ```

## Testing Methods

### Method 1: Browser Console (Simple)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chat Test</title>
    <script src="https://cdn.socket.io/4.8.3/socket.io.min.js"></script>
</head>
<body>
    <h1>WebSocket Chat Test</h1>
    
    <div>
        <input type="text" id="token" placeholder="JWT Token" style="width: 400px"><br><br>
        <input type="number" id="chatRoomId" placeholder="Chat Room ID" style="width: 200px">
        <button onclick="connect()">Connect</button><br><br>
        
        <input type="text" id="message" placeholder="Type message..." style="width: 300px">
        <button onclick="sendMessage()">Send</button>
        <button onclick="joinRoom()">Join Room</button>
        <button onclick="leaveRoom()">Leave Room</button>
    </div>
    
    <div id="messages" style="border: 1px solid #ccc; height: 300px; overflow-y: scroll; margin-top: 20px; padding: 10px;"></div>
    
    <script>
        let socket;
        
        function connect() {
            const token = document.getElementById('token').value;
            
            socket = io('http://localhost:3000/chat', {
                auth: {
                    token: token
                }
            });
            
            socket.on('connect', () => {
                console.log('✅ Connected to WebSocket');
                addMessage('Connected to chat server');
            });
            
            socket.on('disconnect', () => {
                console.log('❌ Disconnected from WebSocket');
                addMessage('Disconnected from chat server');
            });
            
            socket.on('newMessage', (data) => {
                console.log('📩 New message:', data);
                addMessage(`User ${data.senderId}: ${data.content}`);
            });
            
            socket.on('userJoined', (data) => {
                console.log('👤 User joined:', data);
                addMessage(data.message);
            });
            
            socket.on('userLeft', (data) => {
                console.log('👋 User left:', data);
                addMessage(data.message);
            });
            
            socket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error);
                addMessage('Connection error: ' + error.message);
            });
        }
        
        function joinRoom() {
            const chatRoomId = parseInt(document.getElementById('chatRoomId').value);
            socket.emit('joinRoom', { chatRoomId });
        }
        
        function leaveRoom() {
            const chatRoomId = parseInt(document.getElementById('chatRoomId').value);
            socket.emit('leaveRoom', { chatRoomId });
        }
        
        function sendMessage() {
            const chatRoomId = parseInt(document.getElementById('chatRoomId').value);
            const message = document.getElementById('message').value;
            
            socket.emit('sendMessage', {
                chatRoomId: chatRoomId,
                content: message
            });
            
            document.getElementById('message').value = '';
        }
        
        function addMessage(text) {
            const messages = document.getElementById('messages');
            const div = document.createElement('div');
            div.textContent = new Date().toLocaleTimeString() + ': ' + text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }
        
        // Enter key to send message
        document.getElementById('message').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    </script>
</body>
</html>
```

### Method 2: Postman WebSocket Testing

1. **Create WebSocket Request**:
   - URL: `ws://localhost:3000/chat`
   - Auth: `{"token": "YOUR_JWT_TOKEN"}`

2. **Listen to Events**:
   - `newMessage`
   - `userJoined`
   - `userLeft`

3. **Send Events**:
   - **Join Room**:
     ```json
     {
       "event": "joinRoom",
       "data": {"chatRoomId": 1}
     }
     ```
   
   - **Send Message**:
     ```json
     {
       "event": "sendMessage",
       "data": {"chatRoomId": 1, "content": "Hello!"}
     }
     ```

### Method 3: Node.js Test Client

```javascript
// test-client.js
const io = require('socket.io-client');

// Get JWT token from login or use existing one
const token = 'YOUR_JWT_TOKEN';

const socket = io('http://localhost:3000/chat', {
  auth: {
    token: token
  }
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
  
  // Join room 1
  socket.emit('joinRoom', { chatRoomId: 1 });
});

socket.on('newMessage', (data) => {
  console.log('📩 New message:', data);
});

socket.on('userJoined', (data) => {
  console.log('👤 User joined:', data);
});

socket.on('userLeft', (data) => {
  console.log('👋 User left:', data);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

// Send message after 2 seconds
setTimeout(() => {
  socket.emit('sendMessage', {
    chatRoomId: 1,
    content: 'Hello from test client!'
  });
}, 2000);
```

Run with: `node test-client.js`

## Step-by-Step Testing

### 1. Start Server
```bash
npm run start:dev
```

### 2. Get JWT Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@devdating.com","password":"password123"}'
```

Copy the `access_token` from response.

### 3. Test WebSocket Connection

**Using Browser**:
1. Save the HTML file as `test-chat.html`
2. Open in browser
3. Paste JWT token
4. Click "Connect"
5. Check console for logs

**Expected Console Logs**:
```
🔌 WebSocket Gateway initialized
🔗 Client connected: abc123
✅ Client authenticated: abc123 User ID: 9
📱 User 9 joining room 1
💬 Message from user 9 in room 1: Hello everyone!
```

### 4. Test Multiple Users

1. Open two browser tabs
2. Connect both with different user tokens
3. Join same room
4. Send messages from one tab
5. Messages should appear in both tabs

### 5. Verify Server Logs

When WebSocket works correctly, you should see:
```
🔌 WebSocket Gateway initialized
🔗 Client connected: abc123
✅ Client authenticated: abc123 User ID: 9
📱 User 9 joining room 1
💬 Message from user 9 in room 1: Hello everyone!
```

## Troubleshooting

### Connection Errors:
1. **Invalid Token**: Check JWT token is valid and not expired
2. **CORS Issues**: Verify CORS allows your origin
3. **Namespace**: Ensure using `/chat` namespace
4. **Port**: Verify server runs on port 3000

### Message Not Sending:
1. **Room Joined**: Ensure you joined the room first
2. **Authentication**: Check token is valid
3. **Database**: Verify MessageService is working

### No Real-time Updates:
1. **Same Room**: Ensure both users joined same room
2. **Event Listeners**: Check client listens to `newMessage`
3. **Server Emission**: Verify server emits to correct room

## Expected Behavior

1. **Connection**: Client connects with JWT → Server validates → Client authenticated
2. **Join Room**: User joins room → Others notified
3. **Send Message**: Message saved → Emitted to room → All users receive
4. **Leave Room**: User leaves → Others notified
5. **Disconnection**: Clean disconnect with logging

## Security Notes

- **JWT Required**: All connections must provide valid JWT
- **Room Isolation**: Users only receive messages from rooms they joined
- **Token Validation**: Invalid tokens are rejected immediately
- **User Context**: All actions are associated with authenticated user
