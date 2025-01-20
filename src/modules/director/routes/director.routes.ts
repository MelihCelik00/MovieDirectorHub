import { Router } from 'express';
import { wrapRoute } from '../../shared/utils/route-wrapper';
import { DirectorFactory } from '../director.factory';
import { cacheResponse, invalidateEntityCache } from '../../../middleware/cache.middleware';

const router = Router();
const controller = DirectorFactory.getController();

/**
 * @swagger
 * /directors:
 *   get:
 *     summary: Get all directors with pagination
 *     tags: [Directors]
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
 *           enum: [firstName, lastName, birthDate]
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
 *         description: List of directors with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Director'
 *                 total:
 *                   type: integer
 *                   description: Total number of directors
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
router.get('/', cacheResponse, wrapRoute(controller.getAllDirectors));

/**
 * @swagger
 * /directors/search/date-range:
 *   get:
 *     summary: Search directors by birth date range
 *     tags: [Directors]
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
 *         description: List of directors within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 */
router.get('/search/date-range', wrapRoute(controller.findDirectorsByDateRange));

/**
 * @swagger
 * /directors/search:
 *   get:
 *     summary: Search directors by first name or last name
 *     tags: [Directors]
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Director's first name to search for
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Director's last name to search for
 *     responses:
 *       200:
 *         description: List of directors matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 */
router.get('/search', wrapRoute(controller.findDirectorByName));

/**
 * @swagger
 * /directors/{id}:
 *   get:
 *     summary: Get a director by ID
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the director
 *     responses:
 *       200:
 *         description: Director details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       404:
 *         description: Director not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', wrapRoute(controller.getDirectorById));

/**
 * @swagger
 * /directors:
 *   post:
 *     summary: Create a new director
 *     tags: [Directors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Director created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', invalidateEntityCache('directors'), wrapRoute(controller.createDirector));

/**
 * @swagger
 * /directors/{id}:
 *   put:
 *     summary: Update a director
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the director
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Director updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 *       404:
 *         description: Director not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', invalidateEntityCache('directors'), wrapRoute(controller.updateDirector));

/**
 * @swagger
 * /directors/{id}:
 *   delete:
 *     summary: Delete a director
 *     tags: [Directors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the director
 *     responses:
 *       200:
 *         description: Director deleted successfully
 *       404:
 *         description: Director not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', invalidateEntityCache('directors'), wrapRoute(controller.deleteDirector));

export default router; 