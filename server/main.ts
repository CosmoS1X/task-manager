import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { loggerConfig, corsConfig, validatorConfig, sessionConfig } from './configs';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import env from '../env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);

  app.use(sessionConfig);
  app.enableCors(corsConfig);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validatorConfig));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(env.PORT);
}

bootstrap();
