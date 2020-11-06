import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,  } from 'class-validator';

export class FinishTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  transactionId: number;
}
