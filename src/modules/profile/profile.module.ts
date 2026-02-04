import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { User } from '../users/user.entity';
import { ProfileCompletedGuard } from 'src/common/guards/profile-completed.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [ProfileService, ProfileCompletedGuard],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
