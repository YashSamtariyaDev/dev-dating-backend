const https = require('https');

function checkServerHealth() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      protocol: 'https:',
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      rejectUnauthorized: false
    }, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => resolve(false));
    req.end();
  });
}

async function quickHealthCheck() {
  console.log('🔍 Checking server health...\n');
  
  const isServerRunning = await checkServerHealth();
  
  if (isServerRunning) {
    console.log('✅ Server is running on https://localhost:3000');
    console.log('🚀 Ready to run email test!\n');
    console.log('📋 Next steps:');
    console.log('1. Keep this server running');
    console.log('2. Open a NEW terminal window');
    console.log('3. Run: node end-to-end-email-test.js');
    console.log('4. Check results and Ethereal inbox');
  } else {
    console.log('❌ Server is NOT running');
    console.log('🔧 Please start the server first:');
    console.log('   npm run start:dev');
    console.log('\nThen run this health check again.');
  }
}

quickHealthCheck();
