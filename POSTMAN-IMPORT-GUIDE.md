# 📋 Postman Import Guide

## 🔧 Step-by-Step Instructions

### Method 1: Direct Import (Recommended)

1. **Open Postman**
2. **Click Import** button (top left)
3. **Select File** → Choose `DevDating-API-Simplified.postman_collection.json`
4. **Click Import**

### Method 2: If Import Fails

#### Option A: Copy-Paste Method
1. **Open Postman**
2. **Click Import** → **Raw Text**
3. **Copy the entire JSON content** from the file below
4. **Paste into the text area**
5. **Click Import**

#### Option B: Manual Creation
1. **Open Postman**
2. **Create New Collection** → Name it "DevDating API"
3. **Add these requests manually:**

---

## 📝 Manual API Requests (If Import Still Fails)

### 1. Login Request
- **Method:** POST
- **URL:** `https://localhost:3000/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:** 
```json
{
  "email": "t12@devdating.com",
  "password": "123456"
}
```

### 2. Get Profile
- **Method:** GET
- **URL:** `https://localhost:3000/profile/me`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`

### 3. Update Profile
- **Method:** PATCH
- **URL:** `https://localhost:3000/profile/me`
- **Headers:** 
  - `Authorization:Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "bio": "Full-stack developer passionate about building amazing apps!",
  "age": 28,
  "minAge": 25,
  "maxAge": 35,
  "maxDistance": 50,
  "location": "San Francisco, CA",
  "techStack": ["JavaScript", "TypeScript", "React", "Node.js"],
  "experienceLevel": "senior"
}
```

### 4. Upload Photo
- **Method:** POST
- **URL:** `https://localhost:3000/profile/upload-photo`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`
- **Body:** Form-data → Key: `photo` → Type: File → Choose image

### 5. Get Chats
- **Method:** GET
- **URL:** `https://localhost:3000/chat-rooms/my`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`

### 6. Send Message
- **Method:** POST
- **URL:** `https://localhost:3000/chat-rooms/send-message`
- **Headers:** 
  - `Authorization:Bearer YOUR_TOKEN_HERE`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "content": "Hello! This is a test message.",
  "chatRoomId": 1
}
```

### 7. Get Feed
- **Method:** GET
- **URL:** `https://localhost:3000/users/feed?page=1&limit=20`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`

### 8. Send Email Verification
- **Method:** POST
- **URL:** `https://localhost:3000/account/send-verification`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`

### 9. Deactivate Account
- **Method:** POST
- **URL:** `https://localhost:3000/account/deactivate`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`

### 10. Request Account Deletion
- **Method:** POST
- **URL:** `https://localhost:3000/account/request-deletion`
- **Headers:** `Authorization:Bearer YOUR_TOKEN_HERE`

---

## 🚀 Quick Testing Steps

1. **First: Login** → Copy the `accessToken` from response
2. **Replace `YOUR_TOKEN_HERE`** with your actual token
3. **Test Profile APIs** → Get, Update, Upload Photo
4. **Test Chat APIs** → Get chats, Send messages
5. **Test Feed API** → Get recommendations
6. **Test Account APIs** → Verification, Deactivation, Deletion

---

## 🔍 Troubleshooting

### If you see "Invalid JSON" error:
- Use the **Simplified** version I created
- Or use the **Manual Creation** method above

### If requests fail:
- Make sure server is running: `https://localhost:3000`
- Check that you're using HTTPS (not HTTP)
- Verify your auth token is correct and not expired

### If file upload doesn't work:
- Make sure you're using **form-data** body type
- Select a real image file (JPEG, PNG, GIF, WebP)
- File size must be under 5MB

---

## 📞 Alternative: Use curl Commands

If Postman continues to have issues, you can test with these curl commands:

```bash
# Login
curl -k -X POST "https://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"t12@devdating.com","password":"123456"}'

# Get Profile (replace TOKEN)
curl -k -X GET "https://localhost:3000/profile/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Try the simplified collection first - it should work!** 🎉
