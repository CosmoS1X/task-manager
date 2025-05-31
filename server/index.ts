import express from 'express';
import path from 'path';
import passport from './lib/passport';
import { morganConfig, corsConfig, sessionConfig } from './config';
import routers from './routes';
import { errorHandler } from './middlewares';
import env from '../env';

const app = express();

app.use(morganConfig);
app.use(corsConfig);
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/api', ...routers);
app.use(errorHandler);

if (env.isProduction) {
  const clientPath = path.join(__dirname, '..');

  app.use(express.static(clientPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

export default app;
