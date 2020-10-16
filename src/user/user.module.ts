import { Module } from '@nestjs/common';
import { PerfilModule } from '../perfil/perfil.module';
import { SendEmailModule } from '../sendEmail/sendEmail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]),SendEmailModule, PerfilModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
