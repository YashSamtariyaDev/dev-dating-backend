import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ProfileModule } from '../profile/profile.module';
import { UserAction } from './dto/user-action.entity';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAction]), ProfileModule, MatchingModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
