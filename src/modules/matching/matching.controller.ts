import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { MatchingService } from './matching.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProfileCompletedGuard } from '../../common/guards/profile-completed.guard';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('swipe')
  @UseGuards(ProfileCompletedGuard)
  createSwipe(
    @CurrentUser() user,
    @Body() dto: CreateSwipeDto,
  ) {
    return this.matchingService.createSwipe(Number(user.userId), dto);
  }

  @Get('matches')
  getMyMatches(@CurrentUser() user) {
    return this.matchingService.getUserMatches(Number(user.userId));
  }

}