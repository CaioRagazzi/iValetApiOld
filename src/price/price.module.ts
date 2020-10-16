import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { PriceController } from './price.controller';
import { Price } from './price.entity';
import { PriceService } from './price.service';

@Module({
  controllers: [PriceController],
  imports: [TypeOrmModule.forFeature([Price]), CompanyModule],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
