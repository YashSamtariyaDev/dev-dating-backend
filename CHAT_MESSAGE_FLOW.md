# Chat & Message Flow Documentation

## Overview
When two users match, a chat room is automatically created via event-driven architecture. Users can then send messages to each other through the chat system.

## Architecture Flow

### 1. Match Creation → Chat Room Creation
```
User A swipes on User B → Match Created Event → Chat Room Auto-Created
```

**Sequence:**
1. User A sends LIKE to User B via `/matching/swipe`
2. User B sends LIKE to User A via `/matching/swipe` 
3. `MatchingService.createSwipe()` detects mutual like
4. Creates Match record in database
5. Emits `match.created` event with `matchId`
6. `MatchListener.handleMatchCreated()` receives event
7. Creates ChatRoom linked to the Match
8. Console logs: `🔥 Match created event triggered` → `✅ Found match: X` → `💬 Chat room created for match`

### 2. Message Sending Flow
```
User sends message → Validation → Store in DB → Return message
```

**Two API endpoints available:**
- `/chat/message` (ChatController - orchestrates via ChatService)
- `/messages` (MessageController - direct to MessageService)

## Database Schema

### Users
```sql
users (id, email, name, password, role, ...)
```

### Profiles  
```sql
profiles (id, userId, bio, gender, lookingFor, techStack, ...)
```

### Matches
```sql
matches (id, user1Id, user2Id, matchedAt, isActive)
```

### Chat Rooms
```sql
chat_rooms (id, match_id, createdAt)
```

### Messages
```sql
messages (id, chatRoomId, senderId, content, createdAt)
```

## API Endpoints

### Authentication Required
All endpoints require JWT token in `Authorization: Bearer <token>` header.

### 1. Create Match ( prerequisite for chat )
```http
POST /matching/swipe
Authorization: Bearer <user_a_token>
Content-Type: application/json

{
  "targetId": 5,
  "type": "LIKE"
}
```

**Response (when match occurs):**
```json
{
  "message": "It's a match!",
  "match": {
    "id": 3,
    "user1Id": 4,
    "user2Id": 5,
    "matchedAt": "2026-03-06T11:30:00.000Z",
    "isActive": true
  }
}
```

### 2. Send Message (via ChatController)
```http
POST /chat/message
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "chatRoomId": 1,
  "content": "Hey! Nice to match with you!"
}
```

**Response:**
```json
{
  "id": 1,
  "chatRoomId": 1,
  "senderId": 4,
  "content": "Hey! Nice to match with you!",
  "createdAt": "2026-03-06T11:35:00.000Z"
}
```

### 3. Send Message (via MessageController)
```http
POST /messages
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "chatRoomId": 1,
  "content": "How's your day going?"
}
```

### 4. Get Messages (via ChatController)
```http
GET /chat/1/messages
Authorization: Bearer <user_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "chatRoomId": 1,
    "senderId": 4,
    "content": "Hey! Nice to match with you!",
    "createdAt": "2026-03-06T11:35:00.000Z"
  },
  {
    "id": 2,
    "chatRoomId": 1,
    "senderId": 5,
    "content": "Great! Thanks for matching!",
    "createdAt": "2026-03-06T11:36:00.000Z"
  }
]
```

### 5. Get Messages (via MessageController)
```http
GET /messages/1
Authorization: Bearer <user_token>
```

### 6. Get My Matches (to find chatRoomIds)
```http
GET /matching/matches
Authorization: Bearer <user_token>
```

**Response:**
```json
[
  {
    "id": 3,
    "user1Id": 4,
    "user2Id": 5,
    "matchedAt": "2026-03-06T11:30:00.000Z",
    "isActive": true,
    "chatRoom": {
      "id": 1,
      "match_id": 3,
      "createdAt": "2026-03-06T11:30:01.000Z"
    }
  }
]
```

## Postman Testing Guide

### Setup
1. **Base URL**: `http://localhost:3000`
2. **Authentication**: JWT Bearer Token
3. **Content-Type**: `application/json`

### Step-by-Step Test Scenario

#### Step 1: Get User Tokens
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user1@devdating.com",
  "password": "password123"
}
```
Copy the `access_token` for both users.

#### Step 2: Create Match
**User 1 swipes on User 2:**
```http
POST /matching/swipe
Authorization: Bearer <user1_token>
Content-Type: application/json

{
  "targetId": 5,
  "type": "LIKE"
}
```

**User 2 swipes on User 1:**
```http
POST /matching/swipe
Authorization: Bearer <user2_token>
Content-Type: application/json

{
  "targetId": 4,
  "type": "LIKE"
}
```

**Expected Response (second swipe):**
```json
{
  "message": "It's a match!",
  "match": {
    "id": 3,
    "user1Id": 4,
    "user2Id": 5,
    "matchedAt": "2026-03-06T11:30:00.000Z",
    "isActive": true
  }
}
```

#### Step 3: Verify Chat Room Creation
Check server console for:
```
🔥 Match created event triggered
✅ Found match: 3
💬 Chat room created for match
```

Or verify in database:
```sql
SELECT * FROM chat_rooms ORDER BY id DESC LIMIT 1;
```

#### Step 4: Get Chat Room ID
```http
GET /matching/matches
Authorization: Bearer <user1_token>
```
Look for `chatRoom.id` in the response.

#### Step 5: Send Messages
**User 1 sends first message:**
```http
POST /chat/message
Authorization: Bearer <user1_token>
Content-Type: application/json

{
  "chatRoomId": 1,
  "content": "Hey! Nice to match with you!"
}
```

**User 2 replies:**
```http
POST /messages
Authorization: Bearer <user2_token>
Content-Type: application/json

{
  "chatRoomId": 1,
  "content": "Great! How are you?"
}
```

#### Step 6: Get Message History
```http
GET /chat/1/messages
Authorization: Bearer <user1_token>
```

## Error Scenarios

### Chat Room Not Found
```http
POST /chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatRoomId": 999,
  "content": "Test"
}
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Chat room not found"
}
```

### User Not Found
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### Unauthorized (Missing Token)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Quick Test Commands

### Using curl
```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@devdating.com","password":"password123"}'

# 2. Create swipe (replace TOKEN and targetId)
curl -X POST http://localhost:3000/matching/swipe \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetId":5,"type":"LIKE"}'

# 3. Send message (replace TOKEN and chatRoomId)
curl -X POST http://localhost:3000/chat/message \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"chatRoomId":1,"content":"Hello!"}'

# 4. Get messages (replace TOKEN)
curl -X GET http://localhost:3000/chat/1/messages \
  -H "Authorization: Bearer TOKEN"
```

## Database Verification Queries

```sql
-- Check matches
SELECT * FROM matches ORDER BY id DESC LIMIT 5;

-- Check chat rooms
SELECT * FROM chat_rooms ORDER BY id DESC LIMIT 5;

-- Check messages
SELECT * FROM messages ORDER BY id DESC LIMIT 5;

-- Full chat with user info
SELECT 
  m.id,
  m.content,
  m.createdAt,
  u.name as sender_name,
  cr.match_id
FROM messages m
JOIN users u ON m.senderId = u.id
JOIN chat_rooms cr ON m.chatRoomId = cr.id
ORDER BY m.createdAt DESC;
```

## Important Notes

1. **Event-Driven**: Chat rooms are created automatically when matches occur
2. **Two Message APIs**: Both `/chat/message` and `/messages` work - they use different controllers but same underlying service
3. **User Validation**: System validates that users exist before allowing messages
4. **Chat Room Validation**: System validates chat room exists before allowing messages
5. **Message Ordering**: Messages are returned in chronological order (ASC by createdAt)
6. **Number IDs**: All IDs are numbers (not UUIDs) for consistency

## Troubleshooting

### If chat room is not created:
1. Check server console for event logs
2. Verify `MatchListener` is registered in `ChatModule`
3. Ensure `EventEmitterModule.forRoot()` is in `AppModule`

### If message sending fails:
1. Verify chat room exists in database
2. Check JWT token is valid
3. Ensure user exists in database
4. Check `MessageModule` is properly imported in `ChatModule`

### If circular dependency errors:
1. Ensure `forwardRef()` is used where needed
2. Check that `MessageModule` exports `MessageService`
3. Verify `ChatModule` imports `MessageModule` with `forwardRef`
