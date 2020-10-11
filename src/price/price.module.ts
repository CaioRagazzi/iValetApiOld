import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { DatabaseModule } from 'src/database/database.module';
import { PriceController } from './price.controller';
import { priceProviders } from './price.provider';
import { PriceService } from './price.service';

@Module({
  controllers: [PriceController],
  imports: [DatabaseModule, CompanyModule],
  providers: [...priceProviders, PriceService],
  exports: [PriceService],
})
export class PriceModule {}
