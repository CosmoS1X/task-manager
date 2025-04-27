#!/usr/bin/env node
import 'dotenv/config';
import debug from 'debug';
import app from '../server';

const port = process.env.PORT || 5000;
const log = debug('server:start');
const errorLog = debug('server:error');

app
  .listen(port, () => {
    log(`✅ Server is running on http://localhost:${port}`);
  })
  .on('error', (err) => {
    errorLog('❌ Server error:', err.message);
    process.exit(1);
  });
