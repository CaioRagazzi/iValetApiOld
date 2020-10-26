import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPriceWeekdayDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  weekday: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyId: string;
}
