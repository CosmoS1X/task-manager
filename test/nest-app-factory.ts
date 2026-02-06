import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../server/app.module';
import { sessionConfig, validatorConfig } from '../server/configs';
import { AllExceptionsFilter, DbExceptionsFilter } from '../server/common/filters';

let app: NestExpressApplication;

export const getNestApp = async (): Promise<NestExpressApplication> => {
  if (app) return app;

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

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
