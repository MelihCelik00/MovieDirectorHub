import { Request, Response, NextFunction } from 'express';
import CacheInterceptor from '../modules/shared/interceptors/cache.interceptor';

const cacheInterceptor = CacheInterceptor.getInstance();

export const cachePagination = async (req: Request, res: Response, next: NextFunction) => {
  await cacheInterceptor.interceptPagination(req, res, next);
};

export const cacheResponse = async (req: Request, res: Response, next: NextFunction) => {
  await cacheInterceptor.interceptResponse(req, res, next);
};

export const invalidateEntityCache = (entityType: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cacheInterceptor.handleEntityUpdate(entityType);
    next();
  } catch (error) {
    next(error);
  }
}; 