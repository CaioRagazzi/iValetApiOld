import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() transaction: InsertTransactionDto,
  ): Promise<InsertResult> {
    try {
      const result = this.transactionService.create(transaction);
      return result;
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
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
