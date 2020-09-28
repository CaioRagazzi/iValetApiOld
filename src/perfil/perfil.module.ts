import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { perfilProviders } from './perfil.provider';
import { PerfilService } from './perfil.service';

@Module({
  imports: [DatabaseModule],
  providers: [...perfilProviders, PerfilService],
  exports: [PerfilService],
})
export class PerfilModule {}
