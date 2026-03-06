import { Module, forwardRef } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileCompletedGuard } from 'src/common/guards/profile-completed.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), forwardRef(() => UsersModule)],
  providers: [ProfileService, ProfileCompletedGuard],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
