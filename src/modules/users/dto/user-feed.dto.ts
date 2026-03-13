import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender } from '../../profile/entities/profile.entity';

export class FeedUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  bio: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  techStack: string[];

  @IsString()
  experienceLevel: string;

  @IsString()
  location: string;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsNumber()
  matchScore: number;
}
