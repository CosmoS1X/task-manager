import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile';

const env = process.env.ENV_NODE || 'development';
const db = knex(config[env]);

Model.knex(db);

export { db, Model };
