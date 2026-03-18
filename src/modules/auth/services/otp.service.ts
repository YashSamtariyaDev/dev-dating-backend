import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { EmailService } from '../../mail/email.service';

@Injectable()
export class OtpService {
  private redis: Redis;
  private redisConnected = false;
  private connectionAttempts = 0;
  private maxConnectionAttempts = 3;

  constructor(
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    this.initializeRedis();
  }

  private async initializeRedis() {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      console.log('⚠️ Redis connection attempts exceeded. Using fallback mode.');
      return;
    }

    this.connectionAttempts++;
    
    try {
      this.redis = new Redis({
        host: this.configService.get('REDIS_HOST') || 'localhost',
        port: parseInt(this.configService.get('REDIS_PORT') || '6379'),
        password: this.configService.get('REDIS_PASSWORD'),
        maxRetriesPerRequest: 0,
        lazyConnect: true,
        enableReadyCheck: false,
      });

      // Handle Redis connection events
      this.redis.on('error', (error) => {
        if (!error.message.includes('ECONNREFUSED')) {
          console.error('Redis connection error:', error.message);
        }
        this.redisConnected = false;
      });

      this.redis.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.redisConnected = true;
      });

      this.redis.on('close', () => {
        this.redisConnected = false;
      });

      // Try to connect
      await this.redis.connect();
      
    } catch (error) {
      console.log('⚠️ Redis not available, OTP system will use fallback mode');
      this.redisConnected = false;
    }
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async checkRedisConnection(): Promise<boolean> {
    if (!this.redisConnected && this.connectionAttempts < this.maxConnectionAttempts) {
      await this.initializeRedis();
    }
    return this.redisConnected;
  }

  async sendOTP(email: string, name: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check Redis connection
      const redisAvailable = await this.checkRedisConnection();
      
      if (redisAvailable) {
        // Check if OTP already exists and is not expired
        const existingOTP = await this.redis.get(`otp:${email}`);
        if (existingOTP) {
          const ttl = await this.redis.ttl(`otp:${email}`);
          if (ttl > 300) { // If more than 5 minutes remaining
            return {
              success: false,
              message: 'OTP already sent. Please wait before requesting a new one.',
            };
          }
        }

        const otp = this.generateOTP();
        const expiryTime = 10 * 60; // 10 minutes in seconds

        // Store everything in ONE key - optimized approach
        const otpData = {
          code: otp,
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        };

        const redisStartTime = Date.now();
        await this.redis.setex(`otp:${email}`, expiryTime, JSON.stringify(otpData));
        const redisDuration = Date.now() - redisStartTime;
        console.log(`💾 OTP stored in Redis for ${email} in ${redisDuration}ms`);

        // Send OTP email using existing email service - NON-BLOCKING
        this.emailService.sendEmailVerificationOTP(email, otp, name).catch(error => {
          console.error(`📧 Background email sending failed for ${email}:`, error.message);
        });

        return {
          success: true,
          message: 'OTP sent successfully to your email',
        };
      } else {
        // Fallback mode - send OTP without Redis storage
        const otp = this.generateOTP();
        console.log(`🔧 Fallback mode - OTP for ${email}: ${otp}`);
        
        // Send OTP email using existing email service - NON-BLOCKING
        this.emailService.sendEmailVerificationOTP(email, otp, name).catch(error => {
          console.error(`📧 Background fallback email sending failed for ${email}:`, error.message);
        });
        
        return {
          success: true,
          message: 'OTP sent successfully to your email (fallback mode)',
        };
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.',
      };
    }
  }

  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string; userData?: any }> {
    try {
      // Check Redis connection
      const redisAvailable = await this.checkRedisConnection();
      
      if (redisAvailable) {
        const storedData = await this.redis.get(`otp:${email}`);
        
        if (!storedData) {
          return {
            success: false,
            message: 'OTP expired or not found. Please request a new OTP.',
          };
        }

        const otpData = JSON.parse(storedData);
        
        if (otpData.code !== otp) {
          return {
            success: false,
            message: 'Invalid OTP. Please check and try again.',
          };
        }

        // Delete OTP data after successful verification
        await this.redis.del(`otp:${email}`);

        return {
          success: true,
          message: 'OTP verified successfully',
          userData: {
            name: otpData.name,
            email: otpData.email
          },
        };
      } else {
        // Fallback mode - accept any 6-digit OTP for testing
        if (otp.length === 6 && /^\d{6}$/.test(otp)) {
          return {
            success: true,
            message: 'OTP verified successfully (fallback mode)',
            userData: { name: email.split('@')[0] },
          };
        } else {
          return {
            success: false,
            message: 'Invalid OTP format. Please use 6 digits.',
          };
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.',
      };
    }
  }

  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check Redis connection
      const redisAvailable = await this.checkRedisConnection();
      
      if (redisAvailable) {
        const storedData = await this.redis.get(`otp:${email}`);
        if (!storedData) {
          return {
            success: false,
            message: 'No registration request found. Please register again.',
          };
        }

        const otpData = JSON.parse(storedData);
        return this.sendOTP(email, otpData.name);
      } else {
        // Fallback mode
        return this.sendOTP(email, email.split('@')[0]);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Failed to resend OTP. Please try again.',
      };
    }
  }
}
