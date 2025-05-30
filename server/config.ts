import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import env from '../env';

export const isProduction = env.NODE_ENV === 'production';

export const morganConfig = morgan(isProduction ? 'combined' : 'dev');

export const corsConfig = cors({
  origin: 'http://localhost:3000',
  credentials: true,
});

export const sessionConfig = session({
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
