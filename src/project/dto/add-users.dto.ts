import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddUsersDto {
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  userIds: number[];
}
