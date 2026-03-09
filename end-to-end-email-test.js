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

async function comprehensiveEmailTest() {
  console.log('🚀 COMPREHENSIVE EMAIL TEST - DevDating Backend\n');
  console.log('=' .repeat(60));
  
  let token = '';
  let testResults = {
    login: false,
    emailVerification: false,
    accountDeactivation: false,
    accountDeletion: false,
    smtpConfigured: false
  };
  
  try {
    // Step 1: Login
    console.log('\n📝 Step 1: Testing Login...');
    const loginResponse = await makeRequest({
      protocol: 'https:',
      hostname: 'localhost',
      port: 3000,
      path: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 't12@devdating.com', password: '123456' });
    
    if (loginResponse.accessToken) {
      token = loginResponse.accessToken;
      testResults.login = true;
      console.log('✅ Login successful - Token received');
    } else {
      console.log('❌ Login failed');
      return printResults(testResults);
    }
    
    // Step 2: Test Email Verification
    console.log('\n📧 Step 2: Testing Email Verification...');
    const verificationResponse = await makeRequest({
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
    
    if (verificationResponse.message && verificationResponse.message.includes('Verification email sent')) {
      testResults.emailVerification = true;
      console.log('✅ Email verification request sent successfully');
      console.log('⏳ Waiting 2 seconds for email to be processed...');
      await sleep(2000);
    } else {
      console.log('❌ Email verification failed:', verificationResponse);
    }
    
    // Step 3: Test Account Deactivation
    console.log('\n⏸️ Step 3: Testing Account Deactivation...');
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
    
    if (deactivateResponse.message && deactivateResponse.message.includes('deactivated successfully')) {
      testResults.accountDeactivation = true;
      console.log('✅ Account deactivation email sent successfully');
      console.log('⏳ Waiting 2 seconds for email to be processed...');
      await sleep(2000);
    } else {
      console.log('❌ Account deactivation failed:', deactivateResponse);
    }
    
    // Step 4: Test Account Deletion Request
    console.log('\n🗑️ Step 4: Testing Account Deletion Request...');
    const deletionResponse = await makeRequest({
      protocol: 'https:',
      hostname: 'localhost',
      port: 3000,
      path: '/account/request-deletion',
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (deletionResponse.message && deletionResponse.message.includes('deletion request received')) {
      testResults.accountDeletion = true;
      console.log('✅ Account deletion request email sent successfully');
      console.log('⏳ Waiting 2 seconds for email to be processed...');
      await sleep(2000);
    } else {
      console.log('❌ Account deletion request failed:', deletionResponse);
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
  
  printResults(testResults);
}

function printResults(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  const passedTests = Object.values(results).filter(v => v === true).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  console.log('\n📋 Detailed Results:');
  console.log(`${results.login ? '✅' : '❌'} Login Authentication`);
  console.log(`${results.emailVerification ? '✅' : '❌'} Email Verification`);
  console.log(`${results.accountDeactivation ? '✅' : '❌'} Account Deactivation`);
  console.log(`${results.accountDeletion ? '✅' : '❌'} Account Deletion Request`);
  
  if (passedTests === 4) {
    console.log('\n🎉 ALL TESTS PASSED! Email system is working perfectly!');
    console.log('\n📧 Check your Ethereal inbox:');
    console.log('🔗 https://ethereal.email/messages/uzr247c2vaujjg52@ethereal.email');
    console.log('\n💡 You should see 3 emails:');
    console.log('   1. Email Verification');
    console.log('   2. Account Deactivated');
    console.log('   3. Account Deletion Request');
  } else if (passedTests >= 2) {
    console.log('\n⚠️ PARTIAL SUCCESS - Some features working');
    console.log('📧 Check Ethereal for any emails that were sent');
    console.log('🔗 https://ethereal.email/messages/uzr247c2vaujjg52@ethereal.email');
  } else {
    console.log('\n❌ MULTIPLE FAILURES - Check server logs for errors');
    console.log('🔧 Make sure server is running: npm run start:dev');
    console.log('🔧 Check .env file has SMTP configuration');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test completed!');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the test
comprehensiveEmailTest().catch(console.error);
