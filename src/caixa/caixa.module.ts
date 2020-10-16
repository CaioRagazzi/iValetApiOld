import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { CaixaController } from './caixa.controller';
import { Caixa } from './caixa.entity';
import { CaixaService } from './caixa.service';

@Module({
  controllers: [CaixaController],
  imports: [TypeOrmModule.forFeature([Caixa]), CompanyModule],
  providers: [CaixaService],
  exports: [CaixaService],
})
export class CaixaModule {}
