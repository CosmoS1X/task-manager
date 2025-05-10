import 'dotenv/config';
import debug from 'debug';
import app from '../server';
import { db } from '../server/database';

const port = process.env.PORT || 5000;
const log = debug('server:start');
const errorLog = debug('server:error');

app
  .listen(port, () => {
    log(`✅ Server is running on http://localhost:${port}`);
  })
  .on('error', (error) => {
    errorLog('❌ Server error:', error.message);
    process.exit(1);
  });

db.raw('SELECT 1')
  .then(() => log('✅ Database connected'))
  .catch((error) => errorLog('❌ Database connection failed:', error.message));
