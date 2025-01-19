import Redis from 'ioredis';
import config from '../../../config/config';

export class RedisService {
  private static instance: RedisService;
  private client: Redis;
  private readonly DEFAULT_CACHE_TTL = 300; // 5 min.
  private readonly PAGINATION_CACHE_PREFIX = 'pagination:';
  private readonly ENTITY_CACHE_PREFIX = 'entity:';

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

  public async cachePaginatedResults<T>(
    key: string,
    data: T[],
    ttl: number = this.DEFAULT_CACHE_TTL
  ): Promise<void> {
    const cacheKey = this.PAGINATION_CACHE_PREFIX + key;
    await this.client.setex(cacheKey, ttl, JSON.stringify(data));
    
    await this.client.setex(
      `${cacheKey}:timestamp`,
      ttl,
      Date.now().toString()
    );
  }

  public async getCachedPaginatedResults<T>(key: string): Promise<T[] | null> {
    const cacheKey = this.PAGINATION_CACHE_PREFIX + key;
    
    const [data, cacheTimestamp, lastUpdateTimestamp] = await Promise.all([
      this.client.get(cacheKey),
      this.client.get(`${cacheKey}:timestamp`),
      this.client.get(`${this.ENTITY_CACHE_PREFIX}:lastUpdate`)
    ]);

    // If cache exists but is older than the last update, return null
    if (data && cacheTimestamp && lastUpdateTimestamp) {
      if (parseInt(cacheTimestamp) < parseInt(lastUpdateTimestamp)) {
        return null;
      }
    }

    return data ? JSON.parse(data) : null;
  }

  public async invalidateCache(key: string): Promise<void> {
    const cacheKey = this.PAGINATION_CACHE_PREFIX + key;
    await Promise.all([
      this.client.del(cacheKey),
      this.client.del(`${cacheKey}:timestamp`)
    ]);
  }

  public async invalidateAllPaginationCaches(): Promise<void> {
    const keys = await this.client.keys(`${this.PAGINATION_CACHE_PREFIX}*`);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  public async markEntityUpdated(entityType: string): Promise<void> {
    await this.client.set(
      `${this.ENTITY_CACHE_PREFIX}:${entityType}:lastUpdate`,
      Date.now().toString()
    );
  }
}

export default RedisService; 