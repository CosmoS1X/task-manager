import { ConsoleLogger } from '@nestjs/common';

// https://docs.nestjs.com/techniques/logger
export const loggerConfig = {
  logger: new ConsoleLogger({
    logLevels: ['log', 'warn', 'error', 'fatal', 'debug', 'verbose'],
    colors: true,
    json: false,
    prefix: 'TM Server',
    timestamp: false,
    compact: false,
    maxArrayLength: 100,
    maxStringLength: Infinity,
    sorted: false,
    depth: 5,
    showHidden: true,
  }),
};

export const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

export const validatorConfig = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};
