import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { loggerConfig, corsConfig, validatorConfig, sessionConfig } from './configs';
import env from '../env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig);

  app.enableCors(corsConfig);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validatorConfig));
  app.use(sessionConfig);

  await app.listen(env.PORT);
}

bootstrap();
