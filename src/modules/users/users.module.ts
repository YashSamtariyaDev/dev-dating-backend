import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfileModule } from '../profile/profile.module';
import { UserAction } from './entities/user-action.entity';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAction]),
    forwardRef(() => ProfileModule),
    forwardRef(() => MatchingModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
