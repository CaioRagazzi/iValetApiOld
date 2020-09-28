import { Connection, Repository } from 'typeorm';
import { Perfil } from './perfil.entity';

export const perfilProviders = [
  {
    provide: 'PERFIL_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Perfil),
    inject: ['DATABASE_CONNECTION'],
  },
];