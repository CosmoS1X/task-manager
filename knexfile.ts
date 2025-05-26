import path from 'path';
import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

type EnvironmentUnion = 'production' | 'development' | 'test';

const migrationsDirectory = path.resolve(__dirname, 'server', 'migrations');

const migrationsConfig: Record<EnvironmentUnion, Knex.MigratorConfig> = {
  production: {
    directory: migrationsDirectory,
    extension: 'js',
    loadExtensions: ['.js'],
  },
  development: {
    directory: migrationsDirectory,
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
  test: {
    directory: migrationsDirectory,
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
};

const commonConfig: Knex.Config = {
  useNullAsDefault: true,
  ...knexSnakeCaseMappers(),
};

const config: Record<EnvironmentUnion, Knex.Config> = {
  production: {
    client: 'pg',
    connection: {
      database: process.env.PG_DB,
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl: true,
    },
    migrations: migrationsConfig.production,
    ...commonConfig,
  },
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'db.sqlite'),
    },
    migrations: migrationsConfig.development,
    ...commonConfig,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    debug: true,
    migrations: migrationsConfig.test,
    ...commonConfig,
  },
};

export default config;
