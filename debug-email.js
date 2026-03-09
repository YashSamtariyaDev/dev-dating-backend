const https = require('https');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      ...options,
      rejectUnauthorized: false
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function debugEmailConfig() {
  console.log('🔍 Debugging Email Configuration...\n');
  
  // Login
  const loginResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 't12@devdating.com', password: '123456' });
  
  const token = loginResponse.accessToken;
  console.log('✅ Logged in successfully');
  
  // Check server logs for SMTP configuration
  console.log('\n📧 Testing email with debug info...');
  
  const emailResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/account/send-verification',
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Email API Response:', emailResponse);
  
  console.log('\n🔧 If you see "SMTP not configured" in server logs, the .env file is not being read properly.');
  console.log('📋 Make sure your .env file contains:');
  console.log('SMTP_HOST=smtp.ethereal.email');
  console.log('SMTP_PORT=587');
  console.log('SMTP_SECURE=false');
  console.log('SMTP_USER=uzr247c2vaujjg52@ethereal.email');
  console.log('SMTP_PASS=BAu4PgfgQSspq6b7Yd');
  console.log('APP_NAME=DevDating');
  console.log('FRONTEND_URL=https://localhost:3000');
  console.log('SUPPORT_EMAIL=support@devdating.com');
}

debugEmailConfig().catch(console.error);
