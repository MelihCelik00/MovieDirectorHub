import { Request, Response, NextFunction } from 'express';

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const parsePaginationQuery = (query: PaginationQuery) => {
  const page = query.page ? parseInt(query.page, 10) : 1;
  const limit = query.limit ? parseInt(query.limit, 10) : 10;
  const sort = query.sortBy
    ? { [query.sortBy]: query.sortOrder === 'desc' ? -1 : 1 } as Record<string, 1 | -1>
    : undefined;

  return {
    page,
    limit,
    sort,
  };
}; 