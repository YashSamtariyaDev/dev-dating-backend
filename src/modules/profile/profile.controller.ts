import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

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
}
