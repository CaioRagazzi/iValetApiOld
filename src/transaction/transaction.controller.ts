import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectLiteral } from 'typeorm';
import { FinishTransactionDto } from './dto/finish-transaction.dto';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@UseGuards(AuthGuard('jwt'))
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() transaction: InsertTransactionDto,
  ): Promise<ObjectLiteral> {
    try {
      const isCarIn = await this.transactionService.checkIfCarAlreadyIn(
        transaction.placa,
        transaction.companyId,
      );

      if (isCarIn) {
        throw new HttpException('Cars already in', HttpStatus.BAD_REQUEST);
      }
      const result = await this.transactionService.create(transaction);

      return result.generatedMaps;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('opened/:companyId')
  async getopenedByCompany(
    @Param('companyId') companyId: number,
  ): Promise<Transaction[]> {
    const transaction = this.transactionService.getOpenedByCompanyId(companyId);

    return transaction;
  }

  @Get('finished/:companyId')
  async getfinishedByCompany(
    @Param('companyId') companyId: number,
  ): Promise<Transaction[]> {
    const transaction = this.transactionService.getFinishedByCompanyId(
      companyId,
    );

    return transaction;
  }

  @Put('finish')
  async finish(
    @Query() finishTransactionDto: FinishTransactionDto,
  ): Promise<Transaction> {
    try {
      const transaction = await this.transactionService.finishTransaction(
        finishTransactionDto.transactionId,
      );

      return transaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
