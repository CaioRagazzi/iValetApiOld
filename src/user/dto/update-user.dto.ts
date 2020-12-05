import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserUpdateDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    perfil: number;
}