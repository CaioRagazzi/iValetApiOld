import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaixaModule } from '../caixa/caixa.module';
import { CompanyModule } from '../company/company.module';
import { GatewayModule } from '../gateway/gateway.module';
import { TransactionController } from './transaction.controller';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionSubscriber } from './transactionSubscriber.subscriber';

@Module({
  controllers: [TransactionController],
  imports: [TypeOrmModule.forFeature([Transaction]), CompanyModule, GatewayModule, CaixaModule],
  providers: [TransactionService, TransactionSubscriber],
  exports: [TransactionService],
})
export class TransactionModule {}
