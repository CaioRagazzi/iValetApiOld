import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UserModule],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
