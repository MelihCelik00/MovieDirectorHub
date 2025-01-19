import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller';
import { wrapRoute } from '../../shared/utils/route-wrapper';

const router = Router();
const controller = new MovieController();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of all movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/', wrapRoute(controller.getAllMovies));

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
router.post('/', wrapRoute(controller.createMovie));

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
router.put('/:id', wrapRoute(controller.updateMovie));

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
router.delete('/:id', wrapRoute(controller.deleteMovie));

export default router; 