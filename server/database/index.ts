import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile';
import env from '../../env';

const environment = env?.NODE_ENV;
const db = knex(config[environment as keyof typeof config]);

Model.knex(db);

export { db, Model };
