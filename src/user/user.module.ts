import { Module } from '@nestjs/common';
import { PerfilModule } from 'src/perfil/perfil.module';
import { SendEmailModule } from 'src/senEmail/sendEmail.module';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, SendEmailModule, PerfilModule],
  providers: [...userProviders, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
