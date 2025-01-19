import { Router } from 'express';
import { DirectorController } from '../controllers/director.controller';
import { validateRequest } from '../middleware/validate-request';
import { createDirectorSchema, updateDirectorSchema } from '../schemas/director.schema';

export function createDirectorRouter(controller: DirectorController = new DirectorController()): Router {
  const router = Router();

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
   *             $ref: '#/components/schemas/CreateDirectorRequest'
   *     responses:
   *       201:
   *         description: Director created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Director'
   */
  router.post('/', validateRequest(createDirectorSchema), controller.createDirector);

  /**
   * @swagger
   * /directors:
   *   get:
   *     summary: Get all directors with pagination
   *     tags: [Directors]
   *     parameters:
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/limit'
   *       - $ref: '#/components/parameters/sortBy'
   *       - $ref: '#/components/parameters/sortOrder'
   *     responses:
   *       200:
   *         description: List of directors
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DirectorList'
   */
  router.get('/', controller.getAllDirectors);

  /**
   * @swagger
   * /directors/{id}:
   *   get:
   *     summary: Get a director by ID
   *     tags: [Directors]
   *     parameters:
   *       - $ref: '#/components/parameters/directorId'
   *     responses:
   *       200:
   *         description: Director found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Director'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.get('/:id', controller.getDirectorById);

  /**
   * @swagger
   * /directors/{id}:
   *   put:
   *     summary: Update a director
   *     tags: [Directors]
   *     parameters:
   *       - $ref: '#/components/parameters/directorId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateDirectorRequest'
   *     responses:
   *       200:
   *         description: Director updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Director'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.put('/:id', validateRequest(updateDirectorSchema), controller.updateDirector);

  /**
   * @swagger
   * /directors/{id}:
   *   delete:
   *     summary: Delete a director
   *     tags: [Directors]
   *     parameters:
   *       - $ref: '#/components/parameters/directorId'
   *     responses:
   *       204:
   *         description: Director deleted successfully
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  router.delete('/:id', controller.deleteDirector);

  /**
   * @swagger
   * /directors/search:
   *   get:
   *     summary: Search directors by name
   *     tags: [Directors]
   *     parameters:
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: Name to search for
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/limit'
   *     responses:
   *       200:
   *         description: List of directors matching the search criteria
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DirectorList'
   */
  router.get('/search', controller.searchDirectors);

  return router;
} 