import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateActivityDto {
  @IsNumber()
  @IsNotEmpty()
  start_date: number;

  @IsNumber()
  @IsNotEmpty()
  end_date: number;

  @IsNumber()
  hearthrate: number;

  @IsNumber()
  steps: number;

  @IsNumber()
  distance: number;

  @IsNumber()
  bloodSugarOxygen: number;

  @IsNumber()
  @IsNotEmpty()
  activityTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
