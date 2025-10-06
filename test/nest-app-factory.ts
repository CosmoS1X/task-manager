import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import knex from 'knex';
import { AppModule } from '../server/app.module';
import { sessionConfig, validatorConfig } from '../server/configs';
import { AllExceptionsFilter, DbExceptionsFilter } from '../server/common/filters';
import config from '../knexfile';

let app: NestExpressApplication;

export const getNestApp = async (): Promise<NestExpressApplication> => {
  const testDb = knex(config.test);

  if (app) return app;

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('KnexConnection')
    .useValue(testDb)
    .compile();

  app = module.createNestApplication<NestExpressApplication>();

  app.use(sessionConfig);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validatorConfig));
  app.useGlobalFilters(new AllExceptionsFilter(), new DbExceptionsFilter());

  return app.init();
};

export const closeNestApp = async (): Promise<void> => {
  if (!app) return;

  await app.close();
};
