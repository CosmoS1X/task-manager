import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
import env from './env';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: env.PG_HOST || 'localhost',
  port: env.PG_PORT || 5432,
  database: env.isTest ? 'task_manager_test' : env.PG_DB,
  username: env.isTest ? 'postgres' : env.PG_USER,
  password: env.isTest ? 'postgres' : env.PG_PASSWORD,
  ssl: env.isProduction,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [path.join(__dirname, 'server', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'server', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'typeorm_migrations',
  dropSchema: env.isTest,
  synchronize: env.isTest,
  logging: env.isDevelopment,
  extra: {
    charset: 'utf8mb4',
  },
};

export const AppDataSource = new DataSource(databaseConfig);
