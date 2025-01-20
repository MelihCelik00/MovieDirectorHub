import { Request, Response, NextFunction } from 'express';
import CacheInterceptor from '../modules/shared/interceptors/cache.interceptor';

const cacheInterceptor = CacheInterceptor.getInstance();

export const cacheResponse = async (req: Request, res: Response, next: NextFunction) => {
  await cacheInterceptor.interceptResponse(req, res, next);
};

export const invalidateEntityCache = (entityType: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear cache before processing the request
    await cacheInterceptor.handleEntityUpdate(entityType);

    // Clear cache after successful response
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheInterceptor.handleEntityUpdate(entityType).catch((error) => {
          console.error('Failed to invalidate cache after response:', error);
        });
      }
    });

    next();
  } catch (error) {
    next(error);
  }
}; 