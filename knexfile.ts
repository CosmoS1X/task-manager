import path from 'path';
import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import type { Database } from 'sqlite3';
import env from './env';

type EnvironmentUnion = 'production' | 'development' | 'test';

const prodMigrationsPath = path.resolve(__dirname, 'dist', 'server', 'migrations');
const devMigrationsPath = path.resolve(__dirname, 'server', 'migrations');

const migrationsConfig: Record<EnvironmentUnion, Knex.MigratorConfig> = {
  production: {
    directory: prodMigrationsPath,
    extension: 'js',
    loadExtensions: ['.js'],
  },
  development: {
    directory: devMigrationsPath,
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
  test: {
    directory: devMigrationsPath,
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
};

const commonConfig: Knex.Config = {
  useNullAsDefault: true,
  ...knexSnakeCaseMappers(),
};

const sqlitePoolConfig = {
  afterCreate: (connection: Database, done: (error: Error) => void) => {
    connection.run('PRAGMA foreign_keys = ON', done);
  },
};

const config: Record<EnvironmentUnion, Knex.Config> = {
  production: {
    client: 'pg',
    connection: {
      database: env.PG_DB,
      host: env.PG_HOST,
      port: env.PG_PORT,
      user: env.PG_USER,
      password: env.PG_PASSWORD,
      ssl: true,
    },
    migrations: migrationsConfig.production,
    ...commonConfig,
  },
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(process.cwd(), 'db.sqlite'),
    },
    migrations: migrationsConfig.development,
    pool: sqlitePoolConfig,
    ...commonConfig,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    // debug: true,
    migrations: migrationsConfig.test,
    pool: sqlitePoolConfig,
    ...commonConfig,
  },
};

export default config;
