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

async function testEmailConfig() {
  console.log('🔍 Testing Email Configuration...\n');
  
  // First login to get token
  console.log('📝 Logging in...');
  const loginResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 't12@devdating.com', password: '123456' });
  
  const token = loginResponse.accessToken;
  console.log('✅ Login successful');
  
  // Test email verification
  console.log('\n📧 Testing email verification...');
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
  
  console.log('Email Response:', emailResponse);
  
  // Test account deactivation (should also send email)
  console.log('\n⏸️ Testing account deactivation email...');
  const deactivateResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/account/deactivate',
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Deactivate Response:', deactivateResponse);
  
  console.log('\n🎯 Check your server console for email logs!');
  console.log('📧 If you see "SMTP not configured" warnings, follow the EMAIL-SETUP-GUIDE.md');
}

testEmailConfig().catch(console.error);
