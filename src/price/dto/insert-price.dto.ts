import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InsertPriceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  type: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  to: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  from: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  weekDay: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
