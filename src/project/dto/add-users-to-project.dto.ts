import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUsersToProjectDto {
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  userIds?: number[];
}
