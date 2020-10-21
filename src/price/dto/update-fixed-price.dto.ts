import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFixedPriceDto {
  @ApiProperty()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  uniqueIdPrice: string;
}