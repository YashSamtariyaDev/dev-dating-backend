import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { InitiateRegistrationDto } from '../dto/initiate-registration.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate-registration')
  async initiateRegistration(@Body() dto: InitiateRegistrationDto) {
    return this.authService.initiateRegistration(dto);
  }

  @Post('verify-email')
  async verifyEmailAndRegister(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmailAndRegister(dto.email, dto.otp, {
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });
  }

  @Post('resend-otp')
  async resendOTP(@Body() dto: ResendOtpDto) {
    return this.authService.resendOTP(dto.email);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
