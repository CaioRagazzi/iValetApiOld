import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MonthlyPricesUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  valor: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  descricao: string;
}
