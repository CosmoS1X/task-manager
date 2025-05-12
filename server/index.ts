import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import usersRouter from './routes/users';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', usersRouter);

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '..');

  app.use(express.static(clientPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

export default app;
