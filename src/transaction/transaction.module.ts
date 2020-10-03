import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { DatabaseModule } from 'src/database/database.module';
import { TransactionController } from './transaction.controller';
import { TransactionGateway } from './transaction.gateway';
import { transactionProviders } from './transaction.provider';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  imports: [DatabaseModule, CompanyModule],
  providers: [...transactionProviders, TransactionService, TransactionGateway],
  exports: [TransactionService],
})
export class TransactionModule {}
