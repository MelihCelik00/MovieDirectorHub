import { Options } from 'swagger-jsdoc';
import { config } from './index';

/**
 * Swagger configuration options
 */
export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Service API',
      version: '1.0.0',
      description: `API documentation for the Movie Service.
      
Example movie request body:
\`\`\`json
{
  "title": "Inception",
  "description": "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  "releaseDate": "2010-07-16",
  "genre": "Sci-Fi",
  "rating": 8.8,
  "imdbId": "tt1375666",
  "directorId": "507f1f77bcf86cd799439011"
}
\`\`\`

Note: 
- releaseDate must be in YYYY-MM-DD format (e.g., "2010-07-16")
- directorId must be a valid MongoDB ObjectId (24 character hex string)
`,
      contact: {
        name: 'API Support',
        email: 'support@moviedirectorhub.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}${config.api.prefix}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['error'] },
            code: { type: 'integer' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            path: { type: 'string' },
            details: { type: 'object' },
          },
        },
        Movie: {
          type: 'object',
          required: ['title', 'description', 'releaseDate', 'genre', 'imdbId', 'directorId'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            releaseDate: { 
              type: 'string', 
              pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
              example: '2010-07-16'
            },
            genre: { type: 'string' },
            rating: { type: 'number', minimum: 0, maximum: 10 },
            imdbId: { type: 'string' },
            directorId: { 
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$',
              example: '507f1f77bcf86cd799439011'
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateMovieRequest: {
          type: 'object',
          required: ['title', 'description', 'releaseDate', 'genre', 'imdbId', 'directorId'],
          properties: {
            title: { type: 'string', example: 'Inception' },
            description: { 
              type: 'string',
              example: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
            },
            releaseDate: { 
              type: 'string', 
              pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
              example: '2010-07-16'
            },
            genre: { type: 'string', example: 'Sci-Fi' },
            rating: { type: 'number', minimum: 0, maximum: 10, example: 8.8 },
            imdbId: { type: 'string', example: 'tt1375666' },
            directorId: { 
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$',
              example: '507f1f77bcf86cd799439011'
            },
          },
        },
        UpdateMovieRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            releaseDate: { 
              type: 'string', 
              pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
            },
            genre: { type: 'string' },
            rating: { type: 'number', minimum: 0, maximum: 10 },
            imdbId: { type: 'string' },
            directorId: { 
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$'
            },
          },
        },
        MovieResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['success'] },
            code: { type: 'integer' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            path: { type: 'string' },
            data: { $ref: '#/components/schemas/Movie' },
          },
        },
        PaginatedMovieResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['success'] },
            code: { type: 'integer' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            path: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                movies: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Movie' },
                },
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
      },
      parameters: {
        MovieIdParam: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { 
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
          },
          description: 'Movie ID (24 character hex string)',
        },
        ImdbIdParam: {
          in: 'path',
          name: 'imdbId',
          required: true,
          schema: { type: 'string' },
          description: 'IMDB ID',
        },
        DirectorIdParam: {
          in: 'path',
          name: 'directorId',
          required: true,
          schema: { 
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
          },
          description: 'Director ID (24 character hex string)',
        },
        GenreParam: {
          in: 'path',
          name: 'genre',
          required: true,
          schema: { type: 'string' },
          description: 'Movie genre',
        },
        PageParam: {
          in: 'query',
          name: 'page',
          required: false,
          schema: { type: 'integer', default: 1, minimum: 1 },
          description: 'Page number',
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          required: false,
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 100 },
          description: 'Number of items per page',
        },
        SortParam: {
          in: 'query',
          name: 'sort',
          required: false,
          schema: { type: 'string' },
          description: 'Sort field and order (e.g., "-createdAt" for descending)',
        },
      },
    },
  },
  apis: ['src/routes/*.ts'],
}; 