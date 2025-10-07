import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile';
import env from '../../env';

export const databaseProviders = [
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const environment = env.NODE_ENV as keyof typeof config;
      const knexInstance = knex(config[environment]);

      Model.knex(knexInstance);

      return knexInstance;
    },
  },
];
