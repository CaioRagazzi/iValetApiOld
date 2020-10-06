import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { SendEmailModule } from './sendEmail/sendEmail.module';
import { PerfilModule } from './perfil/perfil.module';
import { TransactionModule } from './transaction/transaction.module';
import { GatewayModule } from './gateway/gateway.module';
import { CaixaModule } from './caixa/caixa.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CompanyModule,
    SendEmailModule,
    PerfilModule,
    TransactionModule,
    GatewayModule,
    CaixaModule,
  ],
})
export class AppModule {}
