import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { Profile } from './src/modules/profile/entities/profile.entity';
import { User } from './src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const profileRepo = app.get<Repository<Profile>>(getRepositoryToken(Profile));
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

  const profiles = await profileRepo.find({ relations: ['user'] });
  
  // Update all other profiles to have required fields for the user to see them
  // User yash is ID 10
  const otherProfiles = profiles.filter(p => p.user?.id !== 10);
  
  console.log(`Updating ${otherProfiles.length} profiles...`);

  for (const profile of otherProfiles) {
    profile.photoUrl = '/uploads/profile-photos/b98ba114710368b77cb64e96fd1dc10ebd.png'; // Using existing photo as dummy
    profile.bio = profile.bio || 'This is a test profile created for development monitoring.';
    profile.gender = profile.gender || (Math.random() > 0.5 ? 'female' : 'male');
    profile.techStack = (profile.techStack && profile.techStack.length > 0) ? profile.techStack : ['React', 'TypeScript', 'Node.js'];
    profile.experienceLevel = profile.experienceLevel || 'mid';
    profile.location = profile.location || 'San Francisco, CA';
    profile.age = profile.age || 25;
    profile.isComplete = true;
    
    await profileRepo.save(profile);

    // Ensure user is active so they show up in feed
    if (profile.user) {
        profile.user.isActive = true;
        await userRepo.save(profile.user);
    }
  }
  
  console.log(`Successfully updated ${otherProfiles.length} profiles to COMPLETE and users to ACTIVE.`);
  await app.close();
}

bootstrap().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
