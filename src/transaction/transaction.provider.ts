import { Connection, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

export const transactionProviders = [
  {
    provide: 'TRANSACTION_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Transaction),
    inject: ['DATABASE_CONNECTION'],
  },
];
