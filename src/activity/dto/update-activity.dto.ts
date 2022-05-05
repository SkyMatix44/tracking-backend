import { IsOptional, IsNumber } from 'class-validator';

export class UpdateActivityDto {
  @IsNumber()
  @IsOptional()
  start_date?: number;

  @IsNumber()
  @IsOptional()
  end_date?: number;

  @IsNumber()
  @IsOptional()
  hearthrate?: number;

  @IsNumber()
  @IsOptional()
  steps?: number;

  @IsNumber()
  @IsOptional()
  distance?: number;

  @IsNumber()
  @IsOptional()
  bloodSugarOxygen?: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  activityTypeId?: number;

  @IsNumber()
  @IsOptional()
  projectId?: number;
}
