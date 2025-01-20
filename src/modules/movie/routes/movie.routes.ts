import { Router } from 'express';
import { wrapRoute } from '../../shared/utils/route-wrapper';
import { MovieFactory } from '../movie.factory';
import { cacheResponse, invalidateEntityCache } from '../../../middleware/cache.middleware';

const router = Router();
const controller = MovieFactory.getController();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, releaseDate, rating, genre]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of movies with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movie'
 *                 total:
 *                   type: integer
 *                   description: Total number of movies
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 */
router.get('/', cacheResponse, wrapRoute(controller.getAllMovies));

/**
 * @swagger
 * /movies/search/genre:
 *   get:
 *     summary: Search movies by genre
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Genre to search for
 *     responses:
 *       200:
 *         description: List of movies matching the genre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/search/genre', wrapRoute(controller.getMoviesByGenre));

/**
 * @swagger
 * /movies/search/release-date:
 *   get:
 *     summary: Search movies by release date range
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of movies within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid date format or range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search/release-date', wrapRoute(controller.getMoviesByReleaseYearRange));

/**
 * @swagger
 * /movies/search/rating:
 *   get:
 *     summary: Search movies by rating range
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         required: true
 *         description: Minimum rating
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         required: true
 *         description: Maximum rating
 *     responses:
 *       200:
 *         description: List of movies within the rating range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/search/rating', wrapRoute(controller.getMoviesByRatingRange));

/**
 * @swagger
 * /movies/imdb/{imdbId}:
 *   get:
 *     summary: Get a movie by IMDB ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: imdbId
 *         schema:
 *           type: string
 *         required: true
 *         description: IMDB ID of the movie
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/imdb/:imdbId', wrapRoute(controller.getMovieByImdbId));

/**
 * @swagger
 * /movies/director/{directorId}:
 *   get:
 *     summary: Get movies by director
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: directorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the director
 *     responses:
 *       200:
 *         description: List of movies by the director
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/director/:directorId', wrapRoute(controller.getMoviesByDirector));

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', wrapRoute(controller.getMovieById));

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
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - releaseDate
 *               - genre
 *               - imdbId
 *               - directorId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               imdbId:
 *                 type: string
 *               directorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', invalidateEntityCache('movies'), wrapRoute(controller.createMovie));

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               imdbId:
 *                 type: string
 *               directorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', invalidateEntityCache('movies'), wrapRoute(controller.updateMovie));

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the movie
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', invalidateEntityCache('movies'), wrapRoute(controller.deleteMovie));

export default router; 