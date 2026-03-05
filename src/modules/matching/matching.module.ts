import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity';
import { Match } from './entities/match.entity';
import { User } from '../users/user.entity';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Swipe, Match, User]), ProfileModule],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService]
})
export class MatchingModule {}
