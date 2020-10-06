import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OpenCaixaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId: number;
}
