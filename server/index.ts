import express from 'express';
import cors from 'cors';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import passport from './lib/passport';
import sessionRouter from './routes/session';
import usersRouter from './routes/users';
import { errorHandler } from './middlewares';

const isProduction = process.env.ENV_NODE === 'production';

const app = express();

app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_KEY || 'cdf49a999da33791f7646f7c5e5874c66b1247c5db7cc77e9d6a7844430cfc43d98f1160eeef3a91b2c6409ae9b4147f8920ec5fa6743b4d82700b310a918a3a',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
    sameSite: 'strict',
  },
  unset: 'destroy',
  rolling: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/api', usersRouter);
app.use('/api', sessionRouter);
app.use(errorHandler);

if (isProduction) {
  const clientPath = path.join(__dirname, '..');

  app.use(express.static(clientPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

export default app;
