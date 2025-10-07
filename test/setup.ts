import { Model } from 'objection';
import knex from 'knex';
import config from '../knexfile';
import { closeNestApp } from './nest-app-factory';

beforeAll(async () => {
  const testDb = knex(config.test);
  Model.knex(testDb);

  await testDb.migrate.latest();
});

afterAll(async () => {
  await closeNestApp();
  await Model.knex().destroy();
});
