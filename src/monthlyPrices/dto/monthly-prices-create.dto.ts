import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class MonthlyPricesCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    price: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    companyId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;
}