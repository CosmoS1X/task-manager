import 'dotenv/config';
import debug from 'debug';
import { envSchema } from './schema';

const log = debug('app:env:log');
const errorLog = debug('app:env:error');

log('Validating environment variables...');

const { data: env, success, error } = envSchema.safeParse(process.env);

if (!success) {
  errorLog('❌ .env validation error:');
  errorLog(error.flatten().fieldErrors);

  process.exit(1);
}

log('✅ Environment variables validated successfully');
log(`✅ Running in ${env.NODE_ENV} mode`);

export default env;
