import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FileUploadService } from '../../upload/file-upload.service';
import { R2StorageService } from '../../upload/r2-storage.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileUploadService: FileUploadService,
    private readonly r2StorageService: R2StorageService,
  ) {}

  @Get('me')
  getMyProfile(@CurrentUser() user) {
    return this.profileService.getOrCreateProfile(Number(user.userId));
  }

  @Patch('me')
  updateMyProfile(
    @CurrentUser() user,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(Number(user.userId), dto);
  }

  @Get('completion-status')
  async getCompletionStatus(@CurrentUser() user) {
    const userId = Number(user.userId);
    const profile = await this.profileService.getOrCreateProfile(userId);
    
    const required = ['bio', 'techStack', 'experienceLevel', 'location', 'gender', 'photoUrl'];
    const missing = required.filter(field => {
      const val = profile[field];
      if (field === 'techStack') return !val || val.length === 0;
      if (typeof val === 'string') return val.trim() === '';
      return !val;
    });

    const isCalculatedComplete = missing.length === 0;

    // Self-healing: if database is incorrect, sync it
    if (profile.isComplete !== isCalculatedComplete) {
      console.log(`🛠️ Self-healing: Syncing isComplete status for user ${userId} to ${isCalculatedComplete}`);
      await this.profileService.updateProfile(userId, { isComplete: isCalculatedComplete } as any);
    }

    return {
      isComplete: isCalculatedComplete,
      missing,
      completionPercentage: Math.round(((required.length - missing.length) / required.length) * 100),
    };
  }

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('photo', FileUploadService.getMulterOptions()))
  async uploadPhoto(
    @CurrentUser() user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Upload to Cloudflare R2
    const photoUrl = await this.r2StorageService.uploadFile(file);
    
    // Update user profile with photo URL (which is now a full public R2 URL)
    await this.profileService.updateProfile(Number(user.userId), {
      photoUrl
    } as any);

    return {
      message: 'Photo uploaded successfully',
      photoUrl
    };
  }
}
