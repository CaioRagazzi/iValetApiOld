import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OpenCloseCaixaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId: number;
}
