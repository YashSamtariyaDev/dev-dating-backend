import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MatchingService } from './matching.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('swipe')
  createSwipe(
    @CurrentUser() user,
    @Body() dto: CreateSwipeDto,
  ) {
    return this.matchingService.createSwipe(Number(user.userId), dto);
  }
}