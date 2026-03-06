import { Module, forwardRef } from '@nestjs/common';
import { MatchingController } from './controllers/matching.controller';
import { MatchingService } from './services/matching.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Swipe } from './entities/swipe.entity';
import { Match } from './entities/match.entity';
import { ProfileModule } from '../profile/profile.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Swipe, Match]),
    forwardRef(() => ProfileModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService]
})
export class MatchingModule {}
