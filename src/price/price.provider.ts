import { Connection, Repository } from 'typeorm';
import { Price } from './price.entity';

export const priceProviders = [
  {
    provide: 'PRICE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Price),
    inject: ['DATABASE_CONNECTION'],
  },
];
