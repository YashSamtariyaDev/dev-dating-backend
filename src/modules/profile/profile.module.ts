import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfileCompletedGuard } from 'src/common/guards/profile-completed.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UsersModule],
  providers: [ProfileService, ProfileCompletedGuard],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
