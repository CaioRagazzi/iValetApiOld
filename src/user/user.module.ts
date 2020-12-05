import { forwardRef, Module } from '@nestjs/common';
import { PerfilModule } from '../perfil/perfil.module';
import { SendEmailModule } from '../sendEmail/sendEmail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { User } from './user.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { UserSubscriber } from './userSubscriber.subscriber';
import { CompanyModule } from 'src/company/company.module';
import { UserCompanyModule } from 'src/userCompany/userCompany.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SendEmailModule,
    PerfilModule,
    CustomerModule,
    forwardRef(() => CompanyModule),
    forwardRef(() => UserCompanyModule),
  ],
  providers: [UserService, UserSubscriber],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
