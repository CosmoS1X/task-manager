import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import knex from 'knex';
import { AppModule } from '../server/app.module';
import { sessionConfig, validatorConfig } from '../server/configs';
import { AllExceptionsFilter } from '../server/common/filters/all-exceptions.filter';
import { ObjectionFilter } from '../server/common/filters/objection.filter';
import config from '../knexfile';

let app: NestExpressApplication;

export const getNestApp = async (): Promise<NestExpressApplication> => {
  const testDb = knex(config.test);

  if (app) return app;

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('KnexConnection')
    .useValue(testDb)
    .compile();

  app = moduleFixture.createNestApplication<NestExpressApplication>();

  app.use(sessionConfig);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validatorConfig));
  app.useGlobalFilters(new AllExceptionsFilter(), new ObjectionFilter());

  return app.init();
};

export const closeNestApp = async (): Promise<void> => {
  if (app) {
    await app.close();
  }
};
