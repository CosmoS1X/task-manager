import { Model } from 'objection';
import knex from 'knex';
import config from '../knexfile';

const testConfig = config.test;

beforeAll(async () => {
  const db = knex(testConfig);
  Model.knex(db);

  await db.migrate.latest();
});

afterAll(async () => {
  await Model.knex().destroy();
});
