import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { Gender } from '../../profile/entities/profile.entity';

export class BrowseUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

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
  @IsOptional()
  matchScore?: number;
}
