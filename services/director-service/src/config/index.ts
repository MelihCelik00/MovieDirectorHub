import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment variables schema
 */
const envSchema = z.object({
  // Server
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // MongoDB
  MONGODB_URI: z.string().url(),
  MONGODB_URI_TEST: z.string().url().optional(),
  
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  
  // API
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().url().default('http://localhost:8080'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
});

/**
 * Validate and transform environment variables
 */
const env = envSchema.parse(process.env);

/**
 * Configuration object
 */
export const config = {
  server: {
    port: parseInt(env.PORT, 10),
    nodeEnv: env.NODE_ENV,
  },
  mongodb: {
    uri: env.NODE_ENV === 'test' ? env.MONGODB_URI_TEST! : env.MONGODB_URI,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
  api: {
    prefix: env.API_PREFIX,
    corsOrigin: env.CORS_ORIGIN,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
  },
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const; 