import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../users/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 🔹 AUTO-CREATE PROFILE IF NOT EXISTS
  async getOrCreateProfile(userId: string): Promise<Profile> {
    let profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      const user = await this.userRepo.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      profile = this.profileRepo.create({
        user,
      });

      await this.profileRepo.save(profile);
    }

    return profile;
  }

  // 🔹 UPDATE PROFILE
  async updateProfile(userId: string, data: UpdateProfileDto) {
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

  async isProfileCompleted(userId: string): Promise<boolean> {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
    });

    return !!profile && profile.isComplete === true;
  }

}

