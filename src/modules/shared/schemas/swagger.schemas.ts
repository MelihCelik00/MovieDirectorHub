/**
 * @swagger
 * components:
 *   schemas:
 *     Director:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - birthDate
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the director
 *         firstName:
 *           type: string
 *           description: The director's first name
 *         lastName:
 *           type: string
 *           description: The director's last name
 *         birthDate:
 *           type: string
 *           format: date
 *           description: The director's birth date
 *         bio:
 *           type: string
 *           description: The director's biography
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the director was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the director was last updated
 * 
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - releaseDate
 *         - genre
 *         - imdbId
 *         - directorId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         description:
 *           type: string
 *           description: The movie's description
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: The date when the movie was released
 *         genre:
 *           type: string
 *           description: The genre of the movie
 *         rating:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 10
 *           description: The movie's rating (0-10)
 *         imdbId:
 *           type: string
 *           description: The IMDB ID of the movie
 *         directorId:
 *           type: string
 *           description: The ID of the movie's director
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the movie was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the movie was last updated
 * 
 *     Error:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         code:
 *           type: string
 *           description: Error code
 *         stack:
 *           type: string
 *           description: Stack trace (only in development mode)
 */

// This file is only for Swagger documentation
export {}; 