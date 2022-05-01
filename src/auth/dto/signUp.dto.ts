import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  address: string;

  @IsNumber()
  birthday: number;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;
}
