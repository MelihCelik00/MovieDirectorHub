import { z } from 'zod';
import { Types } from 'mongoose';

/**
 * Base schema for API responses
 */
export const ApiResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  code: z.number(),
  message: z.string(),
  timestamp: z.string(),
  path: z.string(),
});

/**
 * Error response schema extending the base API response
 */
export const ErrorResponseSchema = ApiResponseSchema.extend({
  status: z.literal('error'),
  details: z.any().optional(),
});

/**
 * Movie schema definition for API requests
 */
export const CreateMovieSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "releaseDate must be in YYYY-MM-DD format"
  }),
  genre: z.string().min(1),
  rating: z.number().min(0).max(10).optional(),
  imdbId: z.string().min(1),
  directorId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "directorId must be a valid MongoDB ObjectId (24 hex characters)"
  }),
});

/**
 * Movie schema definition for database
 */
export const MovieSchema = CreateMovieSchema.extend({
  _id: z.instanceof(Types.ObjectId).optional(),
  releaseDate: z.date(),
  directorId: z.instanceof(Types.ObjectId),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Director schema definition
 */
export const DirectorSchema = z.object({
  _id: z.instanceof(Types.ObjectId).optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.date(),
  bio: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Type inference from Zod schemas
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type CreateMovie = z.infer<typeof CreateMovieSchema>;
export type Movie = z.infer<typeof MovieSchema>;
export type Director = z.infer<typeof DirectorSchema>;

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 