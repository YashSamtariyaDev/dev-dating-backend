import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ProfileService } from './src/modules/profile/services/profile.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const profileService = app.get(ProfileService);
  const profile = await profileService.getOrCreateProfile(10);
  console.log("Profile from DB:", profile);
  
  console.log("bio:", !!profile.bio);
  console.log("gender:", !!profile.gender);
  console.log("photoUrl:", !!profile.photoUrl);
  console.log("techStack:", profile.techStack, "length:", profile.techStack?.length, "bool:", !!profile.techStack?.length);
  console.log("experienceLevel:", !!profile.experienceLevel);
  console.log("location:", !!profile.location);
  
  const isComplete = Boolean(
      profile.bio &&
      profile.gender &&
      profile.photoUrl &&
      profile.techStack?.length &&
      profile.experienceLevel &&
      profile.location
  );
  console.log("Evaluated isComplete:", isComplete);
  
  await app.close();
}
bootstrap();
