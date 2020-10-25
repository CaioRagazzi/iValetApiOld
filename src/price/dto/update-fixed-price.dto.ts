import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsOptional()
  @IsNumber()
  to: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  from: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  maxValue: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  uniqueIdPrice: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  gracePeriod: number;
}
