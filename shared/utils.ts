import { PaginationParams, PaginatedResponse } from './types';

/**
 * Creates a paginated response from an array of items
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  { page = 1, limit = 10 }: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: items,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Validates and normalizes pagination parameters
 */
export function normalizePaginationParams(params: PaginationParams): Required<PaginationParams> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));
  const sort = params.sort || '-createdAt';

  return { page, limit, sort };
}

/**
 * Calculates the skip value for pagination
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Formats a MongoDB sort string into a sort object
 * Example: '-createdAt name' => { createdAt: -1, name: 1 }
 */
export function formatSortString(sortStr: string): Record<string, 1 | -1> {
  return sortStr
    .split(' ')
    .filter(Boolean)
    .reduce((acc, field) => {
      const order = field.startsWith('-') ? -1 : 1;
      const key = field.replace(/^-/, '');
      return { ...acc, [key]: order };
    }, {});
}

/**
 * Removes undefined values from an object
 */
export function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Checks if a value is a valid MongoDB ObjectId string
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Safely parses JSON string
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
} 