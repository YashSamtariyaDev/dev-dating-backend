# Email Configuration for DevDating Backend

## 📧 Gmail SMTP Setup (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication on your Gmail
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" for the app
3. Select "Other (Custom name)" and enter "DevDating Backend"
4. Click "Generate"
5. Copy the 16-character password (WITHOUT spaces)

### Step 3: Add Environment Variables
Add these to your `.env` file:

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
APP_NAME=DevDating
FRONTEND_URL=https://localhost:3000
SUPPORT_EMAIL=support@devdating.com
```

### Step 4: Restart Server
```bash
npm run start:dev
```

---

## 🔧 Option 2: Ethereal Email (Testing Only)

If you don't want to use real email, use Ethereal for testing:

### Step 1: Install Ethereal
```bash
npm install ethereal
```

### Step 2: Add Ethereal Configuration
```bash
# Ethereal Testing Configuration
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ethereal-user@ethereal.email
SMTP_PASS=your-ethereal-password
APP_NAME=DevDating
FRONTEND_URL=https://localhost:3000
SUPPORT_EMAIL=support@devdating.com
```

### Step 3: Get Ethereal Credentials
Run this to get test credentials:
```bash
npx ethereal account
```

---

## 🔍 Option 3: Mailtrap (Development Testing)

### Step 1: Sign up for Mailtrap
Go to https://mailtrap.io and sign up for free

### Step 2: Get SMTP Credentials
From Mailtrap dashboard → SMTP Settings → Copy credentials

### Step 3: Add to .env
```bash
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
APP_NAME=DevDating
FRONTEND_URL=https://localhost:3000
SUPPORT_EMAIL=support@devdating.com
```

---

## 🧪 Testing Email Configuration

After setting up SMTP:

1. **Test with Postman:**
   - Send request to `POST /account/send-verification`
   - Check your email inbox

2. **Check Server Logs:**
   - You should see email logs without "SMTP not configured" warnings

3. **Verify Email Links:**
   - Click the verification link in the email
   - Test account deletion/deactivation emails

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid login" with Gmail
**Solution:** Use App Password, NOT your regular Gmail password

### Issue: "Connection timeout"
**Solution:** Check firewall, try different port (465 with SSL)

### Issue: "535 Authentication unsuccessful"
**Solution:** Enable "Less secure apps" or use App Password (recommended)

---

## 📱 Quick Test Script

Create a test file to verify email works:

```javascript
// test-email.js
const https = require('https');

const testEmail = async () => {
  const response = await fetch('https://localhost:3000/account/send-verification', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
      'Content-Type': 'application/json'
    }
  });
  
  console.log(await response.json());
};

testEmail();
```

---

**Choose Option 1 (Gmail) for the easiest real email testing!** 🎯
