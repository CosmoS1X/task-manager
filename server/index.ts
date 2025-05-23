import express from 'express';
import path from 'path';
import passport from './lib/passport';
import { morganConfig, corsConfig, sessionConfig, isProduction } from './config';
import routers from './routes';
import { errorHandler } from './middlewares';

const app = express();

app.use(morganConfig);
app.use(corsConfig);
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/api', ...routers);
app.use(errorHandler);

if (isProduction) {
  const clientPath = path.join(__dirname, '..');

  app.use(express.static(clientPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

export default app;
