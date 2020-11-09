import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from 'src/company/company.module';
import { MonthlyPricesController } from './monthlyPrices.controller';
import { MonthlyPrices } from './monthlyPrices.entity';
import { MonthlyPricesService } from './monthlyPrices.service';

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPrices]), CompanyModule],
  controllers: [MonthlyPricesController],
  providers: [MonthlyPricesService],
  exports: [],
})
export class MonthlyPricesModule {}
