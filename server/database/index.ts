import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile';

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env as keyof typeof config]);

Model.knex(db);

export { db, Model };
