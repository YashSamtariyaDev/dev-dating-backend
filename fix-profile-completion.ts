import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ProfileService } from './src/modules/profile/services/profile.service';
import { Profile } from './src/modules/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const profileService = app.get(ProfileService);
  const profileRepo = app.get<Repository<Profile>>(getRepositoryToken(Profile));

  console.log('--- Starting Profile Re-evaluation ---');

  const profiles = await profileRepo.find({ relations: ['user'] });
  console.log(`Found ${profiles.length} profiles to check.`);

  let updatedCount = 0;

  for (const profile of profiles) {
    const wasComplete = profile.isComplete;
    
    // Exact logic from ProfileService.updateProfile
    const isNowComplete = Boolean(
      profile.bio &&
      profile.gender &&
      profile.photoUrl &&
      profile.techStack?.length &&
      profile.experienceLevel &&
      profile.location
    );

    if (wasComplete !== isNowComplete) {
      console.log(`Profile for User ${profile.user?.id} (${profile.user?.email}): ${wasComplete} -> ${isNowComplete}`);
      profile.isComplete = isNowComplete;
      await profileRepo.save(profile);
      updatedCount++;
    }
  }

  console.log(`--- Finished. Updated ${updatedCount} profiles. ---`);
  
  await app.close();
}

bootstrap().catch(err => {
  console.error('Error during profile fix:', err);
  process.exit(1);
});
