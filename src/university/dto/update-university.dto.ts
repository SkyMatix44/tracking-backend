import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUniversityDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;
}