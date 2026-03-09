import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../mail/email.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async requestAccountDeletion(userId: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ 
      where: { id: userId },
      relations: ['profile']
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate deletion token
    const deletionToken = randomBytes(32).toString('hex');
    const deletionTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store deletion token (you might want to add these fields to User entity)
    user['deletionToken'] = deletionToken;
    user['deletionTokenExpiry'] = deletionTokenExpiry;
    await this.userRepo.save(user);

    // Send confirmation email
    await this.emailService.sendAccountDeletionRequest(
      user.email,
      user.name || user.email.split('@')[0],
      deletionToken
    );

    return {
      message: 'Account deletion request received. Please check your email for confirmation link.'
    };
  }

  async confirmAccountDeletion(token: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: {
        deletionToken: token,
        deletionTokenExpiry: { $gt: new Date() }
      } as any
    });

    if (!user) {
      throw new Error('Invalid or expired deletion token');
    }

    // Send confirmation email before deletion
    await this.emailService.sendAccountDeletionConfirmation(
      user.email,
      user.name || user.email.split('@')[0]
    );

    // Soft delete user (mark as inactive)
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await this.userRepo.save(user);

    return {
      message: 'Account successfully deleted. You will receive a confirmation email shortly.'
    };
  }

  async deactivateAccount(userId: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ 
      where: { id: userId },
      relations: ['profile']
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Deactivate account
    user.isActive = false;
    await this.userRepo.save(user);

    // Send deactivation email
    await this.emailService.sendAccountDeactivationConfirmation(
      user.email,
      user.name || user.email.split('@')[0]
    );

    return {
      message: 'Account deactivated successfully. You can reactivate it anytime within 6 months.'
    };
  }

  async reactivateAccount(userId: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Reactivate account
    user.isActive = true;
    await this.userRepo.save(user);

    return {
      message: 'Account reactivated successfully. Welcome back!'
    };
  }

  async sendEmailVerification(userId: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailVerified) {
      return {
        message: 'Email is already verified.'
      };
    }

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token (you might want to add these fields to User entity)
    user['emailVerificationToken'] = verificationToken;
    user['emailVerificationTokenExpiry'] = verificationTokenExpiry;
    await this.userRepo.save(user);

    // Send verification email
    await this.emailService.sendEmailVerification(user.email, verificationToken);

    return {
      message: 'Verification email sent. Please check your inbox.'
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpiry: { $gt: new Date() }
      } as any
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Verify email
    user.isEmailVerified = true;
    user['emailVerificationToken'] = null;
    user['emailVerificationTokenExpiry'] = null;
    await this.userRepo.save(user);

    return {
      message: 'Email verified successfully!'
    };
  }
}
