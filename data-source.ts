import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
import env from './env';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: env.PG_HOST || 'localhost',
  port: env.PG_PORT || 5432,
  database: env.PG_DB,
  username: env.PG_USER,
  password: env.PG_PASSWORD,
  ssl: env.isProduction,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [path.join(__dirname, 'server', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'server', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  dropSchema: false,
  synchronize: false,
  logging: env.isDevelopment,
  extra: {
    charset: 'utf8mb4',
  },
};

export const testDatabaseConfig: DataSourceOptions = {
  ...databaseConfig,
  database: env.PG_DB_TEST || 'task_manager_test',
  username: env.PG_USER_TEST || 'postgres',
  password: env.PG_PASSWORD_TEST || 'postgres',
  dropSchema: true,
  synchronize: true,
  logging: false,
};

export const AppDataSource = new DataSource(env.isTest ? testDatabaseConfig : databaseConfig);
