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

async function sendTestEmail() {
  console.log('📧 Sending test email...\n');
  
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
  
  // Send verification email
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
  
  console.log('✅ Email sent successfully!');
  console.log('📧 View it here: https://ethereal.email/messages/uzr247c2vaujjg52@ethereal.email');
  console.log('\n🔄 Refresh the page to see your email!');
}

sendTestEmail().catch(console.error);
