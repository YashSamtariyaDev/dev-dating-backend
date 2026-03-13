import { IsNumber, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Gender, LookingFor } from '../../profile/entities/profile.entity';
import { UserRole } from '../enum/user-role.enum';

export class AdminUserDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isEmailVerified: boolean;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(LookingFor)
  @IsOptional()
  lookingFor?: LookingFor;

  techStack: string[];

  @IsString()
  experienceLevel: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  githubUsername?: string;

  @IsString()
  @IsOptional()
  linkedinUrl?: string;

  @IsString()
  @IsOptional()
  portfolioUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}
