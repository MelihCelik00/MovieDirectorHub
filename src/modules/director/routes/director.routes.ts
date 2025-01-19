import { Router } from 'express';
import { DirectorController } from '../controllers/director.controller';
import { wrapRoute } from '../../shared/utils/route-wrapper';

const router = Router();
const controller = new DirectorController();

/**
 * @swagger
 * /directors:
 *   get:
 *     summary: Get all directors
 *     tags: [Directors]
 *     responses:
 *       200:
 *         description: List of all directors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Director'
 */
router.get('/', wrapRoute(controller.getAllDirectors));

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
router.post('/', wrapRoute(controller.createDirector));

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
router.put('/:id', wrapRoute(controller.updateDirector));

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
router.delete('/:id', wrapRoute(controller.deleteDirector));

export default router; 