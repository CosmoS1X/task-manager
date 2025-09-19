import { ConsoleLogger } from '@nestjs/common';
import session from 'express-session';
import env from 'env';

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
    enableImplicitConversion: false,
  },
};

export const sessionConfig = session({
  name: 'taskmanager.sid',
  secret: env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // 'true' doesn't work on render.com
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
    sameSite: 'lax', // 'none' doesn't work on render.com
  },
  unset: 'destroy',
  rolling: true,
});
