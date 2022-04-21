import { Role } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsString()
    @IsNotEmpty()
    password : string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    gender: string; //String because a User can also use a custom gender

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsDateString()
    @IsNotEmpty()
    birthday: Date;

    @IsNumber()
    @IsNotEmpty()
    height: number;

    @IsNumber()
    @IsNotEmpty()
    weight:number;

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}