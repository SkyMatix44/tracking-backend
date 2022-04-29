import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
