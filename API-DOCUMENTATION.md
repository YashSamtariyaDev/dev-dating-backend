# 🚀 DevDating Backend API Documentation

## 📋 Overview

Complete API documentation for the DevDating backend application with authentication, profiles, chat, recommendations, and account management.

## 🔧 Setup Instructions

### 1. Import Collection to Postman

1. Open Postman
2. Click **Import** in the top left
3. Select the `DevDating-Backend-Complete-API.postman_collection.json` file
4. Click **Import**

### 2. Configure Environment Variables

The collection uses the following variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `https://localhost:3000` | API base URL |
| `authToken` | *empty* | JWT authentication token |
| `chatRoomId` | `1` | Default chat room ID for testing |
| `verificationToken` | *empty* | Email verification token |
| `deletionToken` | *empty* | Account deletion token |

### 3. Quick Start Guide

#### Step 1: Login
1. Open the **🔐 Authentication** folder
2. Send a request to **Login** endpoint
3. Copy the `accessToken` from the response
4. Update the `authToken` variable in Postman environment

#### Step 2: Test Profile Features
1. Open **👤 Profile Management** folder
2. Test **Get My Profile** to see current profile
3. Test **Update Profile** with new data
4. Test **Upload Profile Photo** with an image file

#### Step 3: Test Chat System
1. Open **💬 Chat System** folder
2. Test **Get My Chats** to see existing conversations
3. Test **Send Message** to send a new message
4. Test **Get Chat Messages** with pagination

## 📚 API Endpoints Documentation

### 🔐 Authentication

#### POST /auth/login
Login to get JWT token for authentication.

**Request Body:**
```json
{
  "email": "t12@devdating.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 9,
    "email": "t12@devdating.com",
    "name": "t12"
  }
}
```

---

### 👤 Profile Management

#### GET /profile/me
Get current user's profile information.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

#### PATCH /profile/me
Update current user's profile information.

**Headers:**
```
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "Full-stack developer passionate about building amazing apps!",
  "age": 28,
  "minAge": 25,
  "maxAge": 35,
  "maxDistance": 50,
  "location": "San Francisco, CA",
  "gender": "male",
  "lookingFor": "female",
  "techStack": ["JavaScript", "TypeScript", "React", "Node.js"],
  "experienceLevel": "senior",
  "githubUrl": "https://github.com/example",
  "linkedinUrl": "https://linkedin.com/in/example"
}
```

#### POST /profile/upload-photo
Upload a profile photo.

**Headers:**
```
Authorization: Bearer {{authToken}}
Content-Type: multipart/form-data
```

**Body (form-data):**
- `photo`: File (JPEG, PNG, GIF, WebP, max 5MB)

---

### 💬 Chat System

#### GET /chat-rooms/my
Get all chat rooms for the current user.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

#### GET /chat-rooms/{chatRoomId}/messages
Get messages from a specific chat room with pagination.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Messages per page (default: 20)

#### POST /chat-rooms/send-message
Send a message to a chat room.

**Headers:**
```
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Hello! This is a test message.",
  "chatRoomId": 1
}
```

#### GET /chat-rooms/{chatRoomId}/unread-count
Get unread message count for a chat room.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

---

### 🔥 Recommendation Feed

#### GET /users/feed
Get personalized recommendation feed with filters.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `minAge`: Minimum age filter
- `maxAge`: Maximum age filter
- `maxDistance`: Maximum distance in km

#### GET /users/feed/stats
Get statistics about the recommendation feed.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

---

### ⚙️ Account Management

#### POST /account/send-verification
Send email verification link to user's email.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

#### GET /account/verify-email/{token}
Verify email using verification token.

#### POST /account/deactivate
Deactivate user account (can be reactivated within 6 months).

**Headers:**
```
Authorization: Bearer {{authToken}}
```

#### POST /account/reactivate
Reactivate a deactivated account.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

#### POST /account/request-deletion
Request account deletion (requires email confirmation).

**Headers:**
```
Authorization: Bearer {{authToken}}
```

#### POST /account/confirm-deletion/{token}
Confirm account deletion using email token.

---

### 💝 Matching System

#### POST /matches
Create a match with another user.

**Headers:**
```
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "targetUserId": 8
}
```

#### GET /matches/my
Get all matches for the current user.

**Headers:**
```
Authorization: Bearer {{authToken}}
```

## 🧪 Testing Scenarios

### Scenario 1: Complete User Onboarding
1. **Login** → Get auth token
2. **Get Profile** → View current profile
3. **Update Profile** → Add detailed information
4. **Upload Photo** → Add profile picture
5. **Send Email Verification** → Verify email address

### Scenario 2: Chat & Matching
1. **Login** → Get auth token
2. **Get Feed** → See potential matches
3. **Create Match** → Match with another user
4. **Get My Chats** → View conversations
5. **Send Message** → Start chatting

### Scenario 3: Account Management
1. **Login** → Get auth token
2. **Request Deletion** → Start deletion process
3. **Confirm Deletion** → Complete deletion (via email token)

## 🔒 Security Notes

- All endpoints (except login/register) require JWT authentication
- Use HTTPS in production (already configured)
- File uploads are validated for type and size
- Email tokens expire after 24 hours
- Account deletion requires email confirmation

## 📧 Email Configuration (Optional)

To enable actual email sending, add these environment variables:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_NAME=DevDating
FRONTEND_URL=https://your-frontend.com
SUPPORT_EMAIL=support@devdating.com
```

## 🚨 Error Handling

Common error responses:

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": ["field1 should not be empty", "field2 must be a valid email"]
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## 📞 Support

For any issues or questions, check the server console logs or contact the development team.

---

**Happy Testing! 🎉**
