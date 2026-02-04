import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsUrl,
} from 'class-validator';
import { ExperienceLevel, Gender } from '../profile.entity';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  lookingFor?: string;

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
}
