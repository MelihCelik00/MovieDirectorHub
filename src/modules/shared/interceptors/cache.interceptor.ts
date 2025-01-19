import { Request, Response, NextFunction } from 'express';
import RedisService from '../services/redis.service';

export class CacheInterceptor {
  private static instance: CacheInterceptor;
  private readonly redisService: RedisService;
  private readonly CACHE_BATCH_SIZE = 100; // Cache 10 pages of 10 items each

  private constructor() {
    this.redisService = RedisService.getInstance();
  }

  public static getInstance(): CacheInterceptor {
    if (!CacheInterceptor.instance) {
      CacheInterceptor.instance = new CacheInterceptor();
    }
    return CacheInterceptor.instance;
  }

  private generateCacheKey(req: Request): string {
    const { path, query } = req;
    const entityType = path.split('/')[2]; // orn. /api/movies -> movies
    const { sortBy, sortOrder } = query;
    return `${entityType}:${sortBy || 'default'}:${sortOrder || 'asc'}`;
  }

  public async interceptPagination(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') {
      return next();
    }

    if (!req.query.page) {
      return next();
    }

    const cacheKey = this.generateCacheKey(req);
    const cachedData = await this.redisService.getCachedPaginatedResults<any>(cacheKey);

    if (cachedData) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = cachedData.slice(startIndex, endIndex);

      return res.json({
        data: paginatedData,
        total: cachedData.length,
        page,
        limit,
        totalPages: Math.ceil(cachedData.length / limit)
      });
    }

    res.locals.cacheKey = cacheKey;
    next();
  }

  public async interceptResponse(req: Request, res: Response, next: NextFunction) {
    const oldJson = res.json;
    const redisService = this.redisService;
    const cacheKey = res.locals.cacheKey;

    // Overrided res.json method for my caching strategy
    res.json = function(data) {
      if (cacheKey && data?.data) {
        redisService.cachePaginatedResults(cacheKey, data.data); // we have to cache full dataset here
      }
      return oldJson.call(this, data);
    };

    next();
  }

  public async handleEntityUpdate(entityType: string): Promise<void> {
    await this.redisService.markEntityUpdated(entityType);
  }
}

export default CacheInterceptor; 