import { Module } from '@nestjs/common';
import { CompanyModule } from 'src/company/company.module';
import { DatabaseModule } from 'src/database/database.module';
import { CaixaController } from './caixa.controller';
import { caixaProviders } from './caixa.provider';
import { CaixaService } from './caixa.service';

@Module({
  controllers: [CaixaController],
  imports: [DatabaseModule, CompanyModule],
  providers: [...caixaProviders, CaixaService],
  exports: [CaixaService],
})
export class CaixaModule {}
