import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthlyCustomer } from './monthlyCustomer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyCustomer])],
  providers: [],
  exports: [],
})
export class MonthlyCustomerModule {}
