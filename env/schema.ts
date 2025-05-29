import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test'])
    .default('production'),
  PORT: z.coerce.number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),
  PG_DB: z.string()
    .min(1, 'DB name cannot be empty'),
  PG_HOST: z.string()
    .min(1, 'DB host cannot be empty')
    .refine((value) => !value.includes('://'), 'Host must not contain a protocol'),
  PG_PORT: z.coerce.number()
    .int()
    .min(1)
    .max(65535)
    .default(5432),
  PG_USER: z.string()
    .min(1, 'DB username cannot be empty'),
  PG_PASSWORD: z.string()
    .min(1, 'DB password cannot be empty'),
  SESSION_KEY: z.string()
    .min(32, 'The secret key must be at least 32 characters long'),
});

export type Env = z.infer<typeof envSchema>;
