import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailVerification(email: string, verificationToken: string) {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL') || 'https://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    console.log(`📧 Email Verification - To: ${email}`);
    console.log(`📧 Verification URL: ${verificationUrl}`);
    
    // Check if SMTP is configured
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    
    console.log(`🔧 SMTP Config - Host: ${smtpHost}, User: ${smtpUser}`);
    
    if (smtpUser && smtpHost) {
      try {
        console.log('📤 Sending email via SMTP...');
        await this.mailerService.sendMail({
          to: email,
          subject: 'Verify Your Email Address',
          template: 'email-verification',
          context: {
            name: email.split('@')[0],
            verificationUrl,
            appName: this.configService.get<string>('APP_NAME') || 'DevDating',
            supportEmail: this.configService.get<string>('SUPPORT_EMAIL') || 'support@devdating.com',
          },
        });
        console.log('✅ Email sent successfully!');
      } catch (error) {
        console.log('❌ Email sending failed:', error.message);
        console.log('🔧 Full error:', error);
      }
    } else {
      console.log('⚠️ SMTP not configured - Email not sent');
      console.log('📋 Required env vars: SMTP_HOST, SMTP_USER, SMTP_PASS');
    }
  }

  async sendAccountDeactivationConfirmation(email: string, name: string) {
    console.log(`📧 Account Deactivated - To: ${email}, Name: ${name}`);
    
    if (this.configService.get<string>('SMTP_USER')) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Account Deactivated',
          template: 'account-deactivated',
          context: {
            name,
            appName: this.configService.get<string>('APP_NAME') || 'DevDating',
            supportEmail: this.configService.get<string>('SUPPORT_EMAIL') || 'support@devdating.com',
            reactivationUrl: `${this.configService.get<string>('FRONTEND_URL') || 'https://localhost:3000'}/reactivate`,
          },
        });
      } catch (error) {
        console.log('⚠️ Email sending failed (SMTP not configured):', error.message);
      }
    }
  }

  async sendAccountDeletionConfirmation(email: string, name: string) {
    console.log(`📧 Account Deleted - To: ${email}, Name: ${name}`);
    
    if (this.configService.get<string>('SMTP_USER')) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Account Deleted',
          template: 'account-deleted',
          context: {
            name,
            appName: this.configService.get<string>('APP_NAME') || 'DevDating',
            supportEmail: this.configService.get<string>('SUPPORT_EMAIL') || 'support@devdating.com',
          },
        });
      } catch (error) {
        console.log('⚠️ Email sending failed (SMTP not configured):', error.message);
      }
    }
  }

  async sendAccountDeletionRequest(email: string, name: string, deletionToken: string) {
    const deletionUrl = `${this.configService.get<string>('FRONTEND_URL') || 'https://localhost:3000'}/confirm-delete?token=${deletionToken}`;
    
    console.log(`📧 Account Deletion Request - To: ${email}, Name: ${name}`);
    console.log(`📧 Deletion URL: ${deletionUrl}`);
    
    if (this.configService.get<string>('SMTP_USER')) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Confirm Account Deletion',
          template: 'account-deletion-request',
          context: {
            name,
            deletionUrl,
            appName: this.configService.get<string>('APP_NAME') || 'DevDating',
            supportEmail: this.configService.get<string>('SUPPORT_EMAIL') || 'support@devdating.com',
          },
        });
      } catch (error) {
        console.log('⚠️ Email sending failed (SMTP not configured):', error.message);
      }
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'https://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log(`📧 Password Reset - To: ${email}`);
    console.log(`📧 Reset URL: ${resetUrl}`);
    
    if (this.configService.get<string>('SMTP_USER')) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Reset Your Password',
          template: 'password-reset',
          context: {
            name: email.split('@')[0],
            resetUrl,
            appName: this.configService.get<string>('APP_NAME') || 'DevDating',
            supportEmail: this.configService.get<string>('SUPPORT_EMAIL') || 'support@devdating.com',
          },
        });
      } catch (error) {
        console.log('⚠️ Email sending failed (SMTP not configured):', error.message);
      }
    }
  }
}
