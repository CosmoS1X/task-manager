import debug from 'debug';
import { AppDataSource } from '../data-source';
import { closeNestApp } from './nest-app-factory';

export const log = debug('app:test:setup');

beforeAll(async () => {
  log('Setting up test database...');

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();

    log('Test database initialized');
  }

  await AppDataSource.synchronize();

  log('Database synchronized');
});

afterAll(async () => {
  log('Tearing down test database...');

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();

    log('Test database connection closed');
  }

  log('Tests completed. Closing Nest application...');

  await closeNestApp();

  log('Nest application closed');
});
