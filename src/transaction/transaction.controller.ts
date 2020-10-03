import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() transaction: InsertTransactionDto,
  ): Promise<ObjectLiteral> {
    const result = await this.transactionService.create(transaction);

    if (result.generatedMaps) {
      return result.generatedMaps;
    } else {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':companyId')
  async getByCompany(
    @Param('companyId') companyId: number,
  ): Promise<Transaction[]> {
    const transaction = this.transactionService.getByCompanyId(companyId);

    return transaction;
  }
}
