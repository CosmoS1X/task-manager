import { z } from 'zod';

const devSessionKey = 'cdf49a999da33791f7646f7c5e5874c66b1247c5db7cc77e9d6a7844430cfc43d98f1160eeef3a91b2c6409ae9b4147f8920ec5fa6743b4d82700b310a918a3a';

export const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'])
    .default('production'),
  PORT: z.number({ coerce: true })
    .min(1)
    .max(65535)
    .default(5000),
  PG_DB: z.string()
    .min(1, 'DB name cannot be empty'),
  PG_HOST: z.string()
    .min(1, 'DB host cannot be empty'),
  PG_PORT: z.number({ coerce: true })
    .int()
    .min(1)
    .max(65535)
    .default(5432),
  PG_USER: z.string()
    .min(1, 'DB username cannot be empty'),
  PG_PASSWORD: z.string()
    .min(1, 'DB password cannot be empty'),
  SESSION_KEY: z.string()
    .min(32, 'The secret key must be at least 32 characters long')
    .refine(
      (value) => !(process.env.NODE_ENV === 'production' && !value),
      'SESSION_KEY must be set in production',
    )
    .default(process.env.NODE_ENV !== 'production' ? devSessionKey : ''),
  ROLLBAR_ACCESS_TOKEN: z.string()
    .optional(),
  isProduction: z.boolean()
    .default(process.env.NODE_ENV === 'production'),
  isDevelopment: z.boolean()
    .default(process.env.NODE_ENV === 'development'),
  isTest: z.boolean()
    .default(process.env.NODE_ENV === 'test'),
});

export type Env = z.infer<typeof envSchema>;
