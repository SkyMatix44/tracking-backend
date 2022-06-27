import { IsNumber, IsOptional } from 'class-validator';

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
  activityTypeId?: number;
}
