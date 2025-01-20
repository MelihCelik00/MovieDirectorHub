import Redis from 'ioredis';
import config from '../../../config/config';

export class RedisService {
  private static instance: RedisService;
  private client: Redis;
  private readonly CACHE_PREFIX = 'cache:';

  private constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(this.CACHE_PREFIX + key);
    return data ? JSON.parse(data) : null;
  }

  public async set<T>(key: string, data: T, ttl: number): Promise<void> {
    await this.client.setex(this.CACHE_PREFIX + key, ttl, JSON.stringify(data));
  }

  public async deletePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(this.CACHE_PREFIX + pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}

export default RedisService; 