import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class InitiateRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
