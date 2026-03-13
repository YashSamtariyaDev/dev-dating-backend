const https = require('https');

class EmailTester {
  constructor(baseUrl = 'https://localhost:3000') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  async makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        protocol: 'https:',
        hostname: 'localhost',
        port: 3000,
        path,
        method,
        headers: { 'Content-Type': 'application/json' },
        rejectUnauthorized: false
      };

      if (this.token) {
        options.headers.Authorization = `Bearer ${this.token}`;
      }

      const req = https.request(options, (res) => {
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
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  async login(email = 'jelefef480@pckage.com', password = '123456') {
    console.log('🔐 Logging in...');
    const response = await this.makeRequest('/auth/login', 'POST', { email, password });
    
    if (response.accessToken) {
      this.token = response.accessToken;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed:', response);
      return false;
    }
  }

  async sendVerificationEmail() {
    console.log('📧 Sending verification email...');
    const response = await this.makeRequest('/account/send-verification', 'POST');
    
    if (response.message && response.message.includes('sent')) {
      console.log('✅ Verification email sent');
      return true;
    } else {
      console.log('❌ Verification email failed:', response);
      return false;
    }
  }

  async sendDeactivationEmail() {
    console.log('⏸️ Sending deactivation email...');
    const response = await this.makeRequest('/account/deactivate', 'POST');
    
    if (response.message && response.message.includes('deactivated')) {
      console.log('✅ Deactivation email sent');
      return true;
    } else {
      console.log('❌ Deactivation email failed:', response);
      return false;
    }
  }

  async runFullTest() {
    console.log('🚀 Email System Test\n' + '='.repeat(40));
    
    const results = {
      login: false,
      verification: false,
      deactivation: false
    };

    // Test Login
    results.login = await this.login();
    if (!results.login) return this.printResults(results);

    // Test Email Verification
    results.verification = await this.sendVerificationEmail();

    // Test Account Deactivation
    results.deactivation = await this.sendDeactivationEmail();

    this.printResults(results);
  }

  printResults(results) {
    console.log('\n' + '='.repeat(40));
    console.log('📊 Test Results:');
    console.log(`${results.login ? '✅' : '❌'} Login`);
    console.log(`${results.verification ? '✅' : '❌'} Email Verification`);
    console.log(`${results.deactivation ? '✅' : '❌'} Account Deactivation`);
    
    const passed = Object.values(results).filter(v => v).length;
    const total = Object.keys(results).length;
    
    console.log(`\n🎯 Score: ${passed}/${total}`);
    
    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED!');
      console.log('📬 Check Gmail: jelefef480@pckage.com');
    } else {
      console.log('⚠️ Some tests failed');
      console.log('💡 Check server logs for details');
    }
  }
}

// Run test if called directly
if (require.main === module) {
  const tester = new EmailTester();
  tester.runFullTest().catch(console.error);
}

module.exports = EmailTester;
