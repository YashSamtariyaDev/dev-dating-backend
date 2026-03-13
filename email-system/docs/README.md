# Email System Setup Guide

## 🎯 Quick Setup

### 1. Gmail Configuration
```bash
# Enable 2FA on Gmail
# Generate App Password: https://myaccount.google.com/apppasswords
# Use "Mail" → "Other (Custom name)" → "DevDating Backend"
# Copy 16-character password (remove spaces)
```

### 2. Update Configuration
Copy `email-system/config/.env.gmail` to your root `.env` file:
```bash
cp email-system/config/.env.gmail .env
```

### 3. Start Server
```bash
npm run start:dev
```

### 4. Test Email System
```bash
node email-system/scripts/test-email.js
```

## 📧 Email Features

- ✅ Email Verification
- ✅ Account Deactivation  
- ✅ Account Deletion Request
- ✅ Beautiful HTML Templates
- ✅ Gmail SMTP Integration

## 🔧 API Endpoints

- `POST /account/send-verification` - Send verification email
- `POST /account/deactivate` - Deactivate account
- `POST /account/request-deletion` - Request account deletion

## 📬 Test Results

Emails are sent to: `jelefef480@pckage.com`
Check Gmail inbox for test emails.

## ✅ Status: WORKING

Gmail SMTP is fully configured and tested.
