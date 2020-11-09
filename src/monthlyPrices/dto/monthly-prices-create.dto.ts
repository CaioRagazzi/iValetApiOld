import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class MonthlyPricesCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    valor: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    companyId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nome: string;

    @ApiProperty()
    @IsString()
    descricao: string;
}