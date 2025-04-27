import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import 'dotenv/config';

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '..');

  app.use(express.static(clientPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

apiRouter.get('/hello', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Hello from Express with TypeScript!' });
});

export default app;
