import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    private readonly usersService: UsersService
  ) { }

  // 🔹 AUTO-CREATE PROFILE IF NOT EXISTS
  async getOrCreateProfile(userId: number): Promise<Profile> {

    let profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {

      const user = await this.usersService.findById(userId);

      profile = this.profileRepo.create({
        user,
      });

      await this.profileRepo.save(profile);
    }

    return profile;
  }

  // 🔹 UPDATE PROFILE
  async updateProfile(userId: number, data: UpdateProfileDto) {
    const profile = await this.getOrCreateProfile(userId);

    Object.assign(profile, data);

    // completion logic
    profile.isComplete = Boolean(
      profile.bio &&
      profile.gender &&
      profile.techStack?.length &&
      profile.experienceLevel &&
      profile.location
    );

    return this.profileRepo.save(profile);
  }

  async isProfileCompleted(userId: number): Promise<boolean> {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
    });

    return !!profile && profile.isComplete === true;
  }

}

