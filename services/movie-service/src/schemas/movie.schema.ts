import { z } from 'zod';
import { CreateMovieSchema } from '@movie-director-hub/shared';

/**
 * Schema for movie creation request
 */
export const createMovieSchema = z.object({
  body: CreateMovieSchema,
  query: z.object({}).strict(),
  params: z.object({}).strict(),
});

/**
 * Schema for movie update request
 */
export const updateMovieSchema = z.object({
  body: CreateMovieSchema.partial(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid movie ID format"
    }),
  }).strict(),
});

/**
 * Schema for movie ID parameter
 */
export const movieIdSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid movie ID format"
    }),
  }).strict(),
});

/**
 * Schema for movie IMDB ID parameter
 */
export const movieImdbIdSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({}).strict(),
  params: z.object({
    imdbId: z.string().min(1),
  }).strict(),
});

/**
 * Schema for pagination query parameters
 */
export const paginationSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({
    page: z.string().optional().transform(Number).pipe(z.number().min(1).default(1)),
    limit: z.string().optional().transform(Number).pipe(z.number().min(1).max(100).default(10)),
    sort: z.string().optional(),
  }).strict(),
  params: z.object({}).strict(),
});

/**
 * Schema for director ID parameter with pagination
 */
export const moviesByDirectorSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({
    page: z.string().optional().transform(Number).pipe(z.number().min(1).default(1)),
    limit: z.string().optional().transform(Number).pipe(z.number().min(1).max(100).default(10)),
    sort: z.string().optional(),
  }).strict(),
  params: z.object({
    directorId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid director ID format"
    }),
  }).strict(),
});

/**
 * Schema for genre parameter with pagination
 */
export const moviesByGenreSchema = z.object({
  body: z.object({}).strict(),
  query: z.object({
    page: z.string().optional().transform(Number).pipe(z.number().min(1).default(1)),
    limit: z.string().optional().transform(Number).pipe(z.number().min(1).max(100).default(10)),
    sort: z.string().optional(),
  }).strict(),
  params: z.object({
    genre: z.string().min(1),
  }).strict(),
}); 