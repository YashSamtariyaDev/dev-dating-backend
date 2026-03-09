const https = require('https');
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const lib = options.protocol === 'https:' ? https : http;
    
    // Set default options for HTTPS
    if (options.protocol === 'https:') {
      options.rejectUnauthorized = false;
    }
    
    const req = lib.request(options, (res) => {
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

async function testRecommendationSystem() {
  console.log('🔥 Testing Tinder-like Recommendation System');
  
  // Login as user t12
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
  
  // Test basic feed
  console.log('\n📱 Testing basic feed...');
  const feedResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/users/feed?limit=10',
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Feed Response:', JSON.stringify(feedResponse, null, 2));
  
  // Test feed with filters
  console.log('\n🎯 Testing feed with age filter...');
  const filteredFeedResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/users/feed?minAge=25&maxAge=35&limit=5',
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Filtered Feed Response:', JSON.stringify(filteredFeedResponse, null, 2));
  
  // Test feed stats
  console.log('\n📊 Testing feed stats...');
  const statsResponse = await makeRequest({
    protocol: 'https:',
    hostname: 'localhost',
    port: 3000,
    path: '/users/feed/stats',
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Feed Stats:', JSON.stringify(statsResponse, null, 2));
}

testRecommendationSystem().catch(console.error);
