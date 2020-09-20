import { createConnection } from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () =>
            await createConnection({
                type: 'mysql',
                host: process.env.DATA_HOST,
                port: +(process.env.PORT),
                username: process.env.USER_NAME,
                password: process.env.USER_PASSWORD,
                database: process.env.DATABASE,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
    },
];