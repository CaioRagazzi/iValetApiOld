import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { SendEmailModule } from './sendEmail/sendEmail.module';
import { PerfilModule } from './perfil/perfil.module';
import { TransactionModule } from './transaction/transaction.module';
import { GatewayModule } from './gateway/gateway.module';
import { CaixaModule } from './caixa/caixa.module';
import { PriceModule } from './price/price.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { User } from './user/user.entity';
import { Caixa } from './caixa/caixa.entity';
import { Company } from './company/company.entity';
import { Transaction } from './transaction/transaction.entity';
import { Perfil } from './perfil/perfil.entity';
import { Price } from './price/price.entity';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/customer.entity';
import { MonthlyCustomerModule } from './monthlyCustomer/monthlyCustomer.module';
import { MonthlyPricesModule } from './monthlyPrices/monthlyPrices.module';
import { MonthlyCustomer } from './monthlyCustomer/monthlyCustomer.entity';
import { MonthlyPrices } from './monthlyPrices/monthlyPrices.entity';
import { UserCompany } from './userCompany/userCompany.entity';
import { UserCompanyModule } from './userCompany/userCompany.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATA_HOST,
      port: +process.env.PORT,
      username: process.env.USER_NAME,
      password: process.env.USER_PASSWORD,
      database: process.env.DATABASE,
      entities: [User, Company, Transaction, Caixa, Perfil, Price, Customer, MonthlyCustomer, MonthlyPrices, UserCompany],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CompanyModule,
    SendEmailModule,
    PerfilModule,
    TransactionModule,
    GatewayModule,
    CaixaModule,
    PriceModule,
    CustomerModule,
    MonthlyCustomerModule,
    MonthlyPricesModule,
    UserCompanyModule
  ],
})
export class AppModule {}
