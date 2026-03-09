import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationController } from './controllers/recommendation.controller';
import { RecommendationService } from './services/recommendation.service';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
