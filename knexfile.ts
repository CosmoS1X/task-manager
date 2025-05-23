import path from 'path';
import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

type EnvironmentUnion = 'production' | 'development' | 'test';

const migrations = {
  directory: path.resolve(__dirname, 'server', 'migrations'),
  extension: 'ts',
  loadExtensions: ['.js'],
};

const config: Record<EnvironmentUnion, Knex.Config> = {
  production: {
    client: 'pg',
    connection: {
      database: process.env.PG_DB,
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl: true,
    },
    useNullAsDefault: true,
    migrations,
    ...knexSnakeCaseMappers(),
  },
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'db.sqlite'),
    },
    useNullAsDefault: true,
    migrations,
    ...knexSnakeCaseMappers(),
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    debug: true,
    migrations,
    ...knexSnakeCaseMappers(),
  },
};

export default config;
