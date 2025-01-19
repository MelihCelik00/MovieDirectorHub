import Redis from 'ioredis';
import config from './config';
import logger from './logger';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Successfully connected to Redis');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

export default redis;

// Cache helper functions
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis cache get error:', error);
    return null;
  }
};

export const cacheSet = async <T>(
  key: string,
  value: T,
  expirationInSeconds = 3600
): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
  } catch (error) {
    logger.error('Redis cache set error:', error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error('Redis cache delete error:', error);
  }
}; 