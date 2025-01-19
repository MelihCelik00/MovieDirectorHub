import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Configuration schema
const configSchema = z.object({
  server: z.object({
    port: z.coerce.number().default(3000),
    nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  }),
  mongodb: z.object({
    uri: z.string().url(),
  }),
  redis: z.object({
    host: z.string().min(1),
    port: z.coerce.number().default(6379),
  }),
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().min(1),
  }),
  rateLimit: z.object({
    windowMs: z.coerce.number().default(900000),
    max: z.coerce.number().default(100),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
  api: z.object({
    prefix: z.string().default('/api'),
    swaggerEnabled: z.coerce.boolean().default(true),
  }),
});

// Configuration type
type Config = z.infer<typeof configSchema>;

const config: Config = configSchema.parse({
  server: {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    max: process.env.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: process.env.LOG_LEVEL,
  },
  api: {
    prefix: process.env.API_PREFIX,
    swaggerEnabled: process.env.SWAGGER_ENABLED,
  },
});

export default config; 