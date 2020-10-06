import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InsertTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  placa: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  prismaNumber: number;
}
