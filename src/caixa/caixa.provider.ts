import { Connection, Repository } from 'typeorm';
import { Caixa } from './caixa.entity';

export const caixaProviders = [
  {
    provide: 'CAIXA_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Caixa),
    inject: ['DATABASE_CONNECTION'],
  },
];
