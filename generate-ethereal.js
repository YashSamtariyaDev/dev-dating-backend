const nodemailer = require('nodemailer');

async function generateEtherealAccount() {
  try {
    console.log('🔧 Generating Ethereal test account...\n');
    
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('✅ Ethereal Test Account Generated!\n');
    console.log('📧 SMTP Credentials:');
    console.log('========================');
    console.log(`SMTP_HOST: smtp.ethereal.email`);
    console.log(`SMTP_PORT: 587`);
    console.log(`SMTP_SECURE: false`);
    console.log(`SMTP_USER: ${testAccount.user}`);
    console.log(`SMTP_PASS: ${testAccount.pass}`);
    console.log('\n📧 Email Preview URL:');
    console.log('=======================');
    console.log(`https://ethereal.email/messages/${testAccount.user}\n`);
    
    console.log('📋 Add these to your .env file:');
    console.log('==================================');
    console.log(`SMTP_HOST=smtp.ethereal.email`);
    console.log(`SMTP_PORT=587`);
    console.log(`SMTP_SECURE=false`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log('APP_NAME=DevDating');
    console.log('FRONTEND_URL=https://localhost:3000');
    console.log('SUPPORT_EMAIL=support@devdating.com');
    
  } catch (error) {
    console.error('❌ Error generating Ethereal account:', error);
  }
}

generateEtherealAccount();
