import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { loggerConfig, corsConfig, validatorConfig } from './configs';
import env from '../env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);

  app.enableCors(corsConfig);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validatorConfig));

  await app.listen(env.PORT);
}

bootstrap();
