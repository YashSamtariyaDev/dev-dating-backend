const https = require('https');

async function quickTest() {
  console.log('🧪 Testing template fallback system...');
  
  const response = await fetch('https://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'jelefef480@pckage.com', password: '123456' }),
    agent: new (require('https').Agent)({ rejectUnauthorized: false })
  });
  
  const data = await response.json();
  
  if (data.accessToken) {
    console.log('✅ Login successful');
    
    const emailResponse = await fetch('https://localhost:3000/account/send-verification', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${data.accessToken}`,
        'Content-Type': 'application/json'
      },
      agent: new (require('https').Agent)({ rejectUnauthorized: false })
    });
    
    const emailData = await emailResponse.json();
    console.log('📧 Email response:', emailData);
    
    if (emailData.message && emailData.message.includes('sent')) {
      console.log('🎉 Email sent successfully via fallback!');
      console.log('📬 Check Gmail: jelefef480@pckage.com');
    }
  }
}

quickTest().catch(console.error);
