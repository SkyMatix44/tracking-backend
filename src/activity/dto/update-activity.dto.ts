import { IsDateString, IsOptional, IsNumber } from 'class-validator';

export class UpdateActivityDto {
  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date: string;

  @IsNumber()
  @IsOptional()
  hearthrate: number;

  @IsNumber()
  @IsOptional()
  steps: number;

  @IsNumber()
  @IsOptional()
  distance: number;

  @IsNumber()
  @IsOptional()
  bloodSugarOxygen: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNumber()
  @IsOptional()
  activityTypeId: number;

  @IsNumber()
  @IsOptional()
  projectId: number;
}
