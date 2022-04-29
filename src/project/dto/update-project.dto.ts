import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  start_date?: number;

  @IsNumber()
  @IsOptional()
  end_date?: number;
}
