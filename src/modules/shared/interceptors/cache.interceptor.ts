import { Request, Response, NextFunction } from 'express';
import RedisService from '../services/redis.service';

export class CacheInterceptor {
  private static instance: CacheInterceptor;
  private readonly redisService: RedisService;
  private readonly TTL = 60; // 1 minute cache

  private constructor() {
    this.redisService = RedisService.getInstance();
  }

  public static getInstance(): CacheInterceptor {
    if (!CacheInterceptor.instance) {
      CacheInterceptor.instance = new CacheInterceptor();
    }
    return CacheInterceptor.instance;
  }

  private shouldCache(req: Request): boolean {
    // Only cache main list endpoints
    return req.method === 'GET' && !req.path.includes('search') && !req.params.id;
  }

  private generateCacheKey(req: Request): string {
    const { path, query } = req;
    const entityType = path.split('/')[2]; // orn. /api/movies -> movies
    const { page = '1', limit = '10', sortBy = 'default', sortOrder = 'asc' } = query;
    return `${entityType}:list:${page}:${limit}:${sortBy}:${sortOrder}`;
  }

  private setNoCacheHeaders(res: Response): void {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store',
      'ETag': Date.now().toString()
    });
  }

  public async interceptResponse(req: Request, res: Response, next: NextFunction) {
    // Always set no-cache headers to prevent browser caching
    this.setNoCacheHeaders(res);

    if (!this.shouldCache(req)) {
      return next();
    }

    const cacheKey = this.generateCacheKey(req);

    // Override res.json to handle caching
    const originalJson = res.json;
    res.json = (data: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Only cache successful responses
        this.redisService.set(cacheKey, data, this.TTL).catch(error => {
          console.error('Failed to set cache:', error);
        });
      }
      return originalJson.call(res, data);
    };

    next();
  }

  public async handleEntityUpdate(entityType: string): Promise<void> {
    try {
      // Delete all caches for this entity type and related entities
      await Promise.all([
        this.redisService.deletePattern(`${entityType}:*`),
        // If directors are updated, invalidate movie caches too and vice versa
        entityType === 'directors' ? this.redisService.deletePattern('movies:*') : null,
        entityType === 'movies' ? this.redisService.deletePattern('directors:*') : null
      ].filter(Boolean));
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
      // Don't throw the error to prevent breaking the request flow
    }
  }
}

export default CacheInterceptor; 