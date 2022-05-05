import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
