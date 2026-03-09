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
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileUploadService } from '../../upload/file-upload.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileUploadService: FileUploadService,
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

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('photo', FileUploadService.getMulterOptions()))
  async uploadPhoto(
    @CurrentUser() user,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const photoUrl = FileUploadService.getProfilePhotoUrl(file.filename);
    
    // Update user profile with photo URL
    await this.profileService.updateProfile(Number(user.userId), {
      photoUrl
    } as any);

    return {
      message: 'Photo uploaded successfully',
      photoUrl: `${req.protocol}://${req.get('host')}${photoUrl}`
    };
  }
}
