import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserCompanyController } from './userCompany.controller';
import { UserCompanyService } from './userCompany.service';
import { UserCompany } from './userCompany.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCompany]),
    forwardRef(() => UserModule),
  ],
  controllers: [UserCompanyController],
  providers: [UserCompanyService],
  exports: [UserCompanyService],
})
export class UserCompanyModule {}
