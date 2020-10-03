import { Module } from '@nestjs/common';
import { TransactionGateway } from './transaction.gateway';

@Module({
  imports: [],
  providers: [TransactionGateway],
  exports: [TransactionGateway],
})
export class GatewayModule {}
