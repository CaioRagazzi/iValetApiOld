import { Module } from '@nestjs/common';
import { UserModule } from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { SendEmailModule } from './senEmail/sendEmail.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CompanyModule,
    SendEmailModule,
  ],
})
export class AppModule { }
