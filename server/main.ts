import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { loggerConfig, corsConfig, validatorConfig, sessionConfig } from './configs';
import { AllExceptionsFilter, DbExceptionsFilter } from './common/filters';
import env from '../env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, loggerConfig);

  app.use(sessionConfig);
  app.enableCors(corsConfig);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validatorConfig));
  app.useGlobalFilters(new AllExceptionsFilter(), new DbExceptionsFilter());

  if (env.isProduction) {
    const clientPath = join(__dirname, '..', 'client');

    app.useStaticAssets(clientPath, { index: false });

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.url.startsWith('/api/')) return next();

      return res.sendFile(join(clientPath, 'index.html'));
    });
  }

  await app.listen(env.PORT);
}

bootstrap();
