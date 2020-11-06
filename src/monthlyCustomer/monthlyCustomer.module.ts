import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';
import { MonthlyCustomerController } from './monthlyCustomer.controller';
import { MonthlyCustomer } from './monthlyCustomer.entity';
import { MonthlyCustomerService } from './monthlyCustomer.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyCustomer]), CompanyModule],
  controllers: [MonthlyCustomerController],
  providers: [MonthlyCustomerService],
  exports: [],
})
export class MonthlyCustomerModule {}
