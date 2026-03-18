import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { comparePassword } from '../../../common/utils/password.util';
import { UserRole } from '../../users/enum/user-role.enum';
import { UsersService } from '../../users/services/users.service';
import { OtpService } from './otp.service';
import { EmailService } from '../../mail/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async initiateRegistration(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const enableVerification = this.configService.get<string>('ENABLE_EMAIL_VERIFICATION') !== 'false';

    if (!enableVerification) {
      console.log(`🚀 Email verification disabled. Creating user directly for ${dto.email}`);
      const user = await this.usersService.createUser({
        email: dto.email,
        password: dto.password,
        name: dto.name,
      });

      // Mark email as verified immediately
      await this.usersService.updateEmailVerification(user.id, true);

      // Generate token for immediate login
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'User registered successfully (verification skipped)',
        userId: user.id,
        accessToken,
        requiresVerification: false,
      };
    }

    // Send OTP for email verification
    const result = await this.otpService.sendOTP(dto.email, dto.name);
    
    return {
      message: result.message || 'OTP sent to your email for verification',
      email: dto.email,
      success: result.success,
      requiresVerification: true,
    };
  }

  async verifyEmailAndRegister(email: string, otp: string, registrationData: RegisterDto) {
    // Verify OTP
    const verificationResult = await this.otpService.verifyOTP(email, otp);
    
    if (!verificationResult.success) {
      throw new UnauthorizedException(verificationResult.message);
    }

    // Create user with email verified
    const user = await this.usersService.createUser({
      email: registrationData.email,
      password: registrationData.password,
      name: registrationData.name,
    });

    // Mark email as verified
    await this.usersService.updateEmailVerification(user.id, true);

    return {
      message: 'User registered successfully with verified email',
      userId: user.id,
      isEmailVerified: true,
    };
  }

  async resendOTP(email: string) {
    return await this.otpService.resendOTP(email);
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !(await comparePassword(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
