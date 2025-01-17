import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { validateRequest } from '../middleware/validate-request';
import {
  createMovieSchema,
  updateMovieSchema,
  movieIdSchema,
  movieImdbIdSchema,
  paginationSchema,
  moviesByDirectorSchema,
  moviesByGenreSchema,
} from '../schemas/movie.schema';

/**
 * Movie routes factory function
 */
export function createMovieRouter(movieController: MovieController): Router {
  const router = Router();

  /**
   * @swagger
   * /movies:
   *   post:
   *     summary: Create a new movie
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateMovieRequest'
   *     responses:
   *       201:
   *         description: Movie created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   */
  router.post(
    '/',
    validateRequest(createMovieSchema),
    movieController.createMovie
  );

  /**
   * @swagger
   * /movies:
   *   get:
   *     summary: Get all movies with pagination
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/PageParam'
   *       - $ref: '#/components/parameters/LimitParam'
   *       - $ref: '#/components/parameters/SortParam'
   *     responses:
   *       200:
   *         description: Movies retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedMovieResponse'
   */
  router.get(
    '/',
    validateRequest(paginationSchema),
    movieController.getAllMovies
  );

  /**
   * @swagger
   * /movies/{id}:
   *   get:
   *     summary: Get a movie by ID
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/MovieIdParam'
   *     responses:
   *       200:
   *         description: Movie retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   */
  router.get(
    '/:id',
    validateRequest(movieIdSchema),
    movieController.getMovieById
  );

  /**
   * @swagger
   * /movies/imdb/{imdbId}:
   *   get:
   *     summary: Get a movie by IMDB ID
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/ImdbIdParam'
   *     responses:
   *       200:
   *         description: Movie retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   */
  router.get(
    '/imdb/:imdbId',
    validateRequest(movieImdbIdSchema),
    movieController.getMovieByImdbId
  );

  /**
   * @swagger
   * /movies/{id}:
   *   put:
   *     summary: Update a movie
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/MovieIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateMovieRequest'
   *     responses:
   *       200:
   *         description: Movie updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   */
  router.put(
    '/:id',
    validateRequest(updateMovieSchema),
    movieController.updateMovie
  );

  /**
   * @swagger
   * /movies/{id}:
   *   delete:
   *     summary: Delete a movie
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/MovieIdParam'
   *     responses:
   *       200:
   *         description: Movie deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovieResponse'
   */
  router.delete(
    '/:id',
    validateRequest(movieIdSchema),
    movieController.deleteMovie
  );

  /**
   * @swagger
   * /movies/director/{directorId}:
   *   get:
   *     summary: Get movies by director ID
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/DirectorIdParam'
   *       - $ref: '#/components/parameters/PageParam'
   *       - $ref: '#/components/parameters/LimitParam'
   *       - $ref: '#/components/parameters/SortParam'
   *     responses:
   *       200:
   *         description: Movies retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedMovieResponse'
   */
  router.get(
    '/director/:directorId',
    validateRequest(moviesByDirectorSchema),
    movieController.getMoviesByDirectorId
  );

  /**
   * @swagger
   * /movies/genre/{genre}:
   *   get:
   *     summary: Get movies by genre
   *     tags: [Movies]
   *     parameters:
   *       - $ref: '#/components/parameters/GenreParam'
   *       - $ref: '#/components/parameters/PageParam'
   *       - $ref: '#/components/parameters/LimitParam'
   *       - $ref: '#/components/parameters/SortParam'
   *     responses:
   *       200:
   *         description: Movies retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedMovieResponse'
   */
  router.get(
    '/genre/:genre',
    validateRequest(moviesByGenreSchema),
    movieController.getMoviesByGenre
  );

  return router;
} 