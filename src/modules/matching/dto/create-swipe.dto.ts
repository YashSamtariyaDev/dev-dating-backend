import { IsEnum, IsNumber } from 'class-validator';
import { SwipeType } from '../entities/swipe.entity';

export class CreateSwipeDto {
  @IsNumber()
  targetId: number;

  @IsEnum(SwipeType)
  type: SwipeType;
}