import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { DatabaseModule } from 'src/database/database.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { TransactionController } from './transaction.controller';
import { transactionProviders } from './transaction.provider';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  imports: [DatabaseModule, CompanyModule, GatewayModule],
  providers: [...transactionProviders, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
