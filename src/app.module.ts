import { Module } from '@nestjs/common';
import { UserModule } from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { SendEmailModule } from './senEmail/sendEmail.module';
import { PerfilModule } from './perfil/perfil.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CompanyModule,
    SendEmailModule,
    PerfilModule
  ],
})
export class AppModule { }
