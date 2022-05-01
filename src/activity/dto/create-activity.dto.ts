import { IsDateString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateActivityDto {
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

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
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  activityTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
