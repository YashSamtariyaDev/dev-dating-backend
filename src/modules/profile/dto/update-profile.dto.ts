import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsUrl,
  IsNumber,
  IsDate,
  IsDecimal,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ExperienceLevel, Gender, LookingFor } from '../entities/profile.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(LookingFor)
  lookingFor?: LookingFor;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  age?: number;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  minAge?: number;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(100)
  maxAge?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  maxDistance?: number;

  @IsOptional()
  @IsDecimal()
  latitude?: number;

  @IsOptional()
  @IsDecimal()
  longitude?: number;

  @IsOptional()
  @IsArray()
  techStack?: string[];

  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  githubUsername?: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
