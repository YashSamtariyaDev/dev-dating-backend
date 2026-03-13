import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/services/users.service';
import { ProfileService } from '../modules/profile/services/profile.service';
import { UserRole } from '../modules/users/enum/user-role.enum';
import { Gender, LookingFor, ExperienceLevel } from '../modules/profile/entities/profile.entity';
import * as bcrypt from 'bcrypt';

const sampleProfiles = [
  {
    name: 'Aarav',
    email: 'aarav@example.com',
    password: 'Password123!',
    profile: {
      bio: 'Frontend Engineer. TypeScript, Next.js, and clean UI. Here to ship and vibe.',
      techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      interests: ['Open Source', 'UI/UX', 'Performance'],
      experienceLevel: ExperienceLevel.SENIOR,
      location: 'Mumbai, India',
      age: 27,
      gender: Gender.MALE,
      lookingFor: LookingFor.BOTH,
      githubUsername: 'aarav',
      linkedinUrl: 'https://linkedin.com/in/aarav',
      portfolioUrl: 'https://aarav.dev',
      isAvailable: true,
    },
  },
  {
    name: 'Meera',
    email: 'meera@example.com',
    password: 'Password123!',
    profile: {
      bio: 'Backend Engineer. NestJS + Redis + Postgres. I like systems that don’t break.',
      techStack: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis'],
      interests: ['Distributed Systems', 'Performance', 'DevOps'],
      experienceLevel: ExperienceLevel.SENIOR,
      location: 'Bangalore, India',
      age: 29,
      gender: Gender.FEMALE,
      lookingFor: LookingFor.BOTH,
      githubUsername: 'meera',
      linkedinUrl: 'https://linkedin.com/in/meera',
      portfolioUrl: 'https://meera.dev',
      isAvailable: true,
    },
  },
  {
    name: 'Ishaan',
    email: 'ishaan@example.com',
    password: 'Password123!',
    profile: {
      bio: 'Full‑Stack Dev. Product-minded dev. Builds fast, iterates faster.',
      techStack: ['React', 'Node.js', 'Prisma', 'GraphQL'],
      interests: ['Product', 'Startups', 'SaaS'],
      experienceLevel: ExperienceLevel.MID,
      location: 'Pune, India',
      age: 25,
      gender: Gender.MALE,
      lookingFor: LookingFor.BOTH,
      githubUsername: 'ishaan',
      linkedinUrl: 'https://linkedin.com/in/ishaan',
      portfolioUrl: 'https://ishaan.dev',
      isAvailable: true,
    },
  },
  {
    name: 'Sana',
    email: 'sana@example.com',
    password: 'Password123!',
    profile: {
      bio: 'DevOps & Cloud. Kubernetes, Terraform, and observability.',
      techStack: ['Kubernetes', 'Terraform', 'AWS', 'Docker'],
      interests: ['Automation', 'Monitoring', 'Security'],
      experienceLevel: ExperienceLevel.SENIOR,
      location: 'Delhi, India',
      age: 30,
      gender: Gender.FEMALE,
      lookingFor: LookingFor.BOTH,
      githubUsername: 'sana',
      linkedinUrl: 'https://linkedin.com/in/sana',
      portfolioUrl: 'https://sana.dev',
      isAvailable: true,
    },
  },
  {
    name: 'Rohan',
    email: 'rohan@example.com',
    password: 'Password123!',
    profile: {
      bio: 'Mobile Dev. React Native & Flutter enthusiast.',
      techStack: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      interests: ['Mobile', 'UI', 'Startups'],
      experienceLevel: ExperienceLevel.MID,
      location: 'Hyderabad, India',
      age: 26,
      gender: Gender.MALE,
      lookingFor: LookingFor.BOTH,
      githubUsername: 'rohan',
      linkedinUrl: 'https://linkedin.com/in/rohan',
      portfolioUrl: 'https://rohan.dev',
      isAvailable: true,
    },
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const profileService = app.get(ProfileService);

  // Clean existing seed data
  for (const sample of sampleProfiles) {
    const existing = await usersService.findByEmail(sample.email);
    if (existing) {
      await usersService.deleteById(existing.id);
    }
  }

  for (const sample of sampleProfiles) {
    const hashedPassword = await bcrypt.hash(sample.password, 10);
    const user = await usersService.createUser({
      email: sample.email,
      password: hashedPassword,
      name: sample.name,
      role: UserRole.USER,
    });
    await profileService.create(user.id, sample.profile);
    await usersService.updateEmailVerification(user.id, true);
    console.log(`✅ Seeded: ${sample.name} (${sample.email})`);
  }

  await app.close();
  console.log('🎉 Seeding complete');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
