import { Options } from 'swagger-jsdoc';
import { config } from './index';

/**
 * Swagger configuration options
 */
export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Director Service API',
      version: '1.0.0',
      description: 'API documentation for the Director Service',
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
            status: {
              type: 'string',
              example: 'error',
            },
            code: {
              type: 'integer',
              example: 400,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            path: {
              type: 'string',
              example: '/api/v1/directors',
            },
          },
        },
        Director: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            firstName: {
              type: 'string',
              example: 'Christopher',
            },
            lastName: {
              type: 'string',
              example: 'Nolan',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1970-07-30',
            },
            bio: {
              type: 'string',
              example: 'British-American film director known for his distinctive style...',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
          required: ['firstName', 'lastName', 'birthDate'],
        },
        CreateDirectorRequest: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Christopher',
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Nolan',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1970-07-30',
            },
            bio: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              example: 'British-American film director known for his distinctive style...',
            },
          },
          required: ['firstName', 'lastName', 'birthDate'],
        },
        UpdateDirectorRequest: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Christopher',
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Nolan',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '1970-07-30',
            },
            bio: {
              type: 'string',
              minLength: 10,
              maxLength: 1000,
              example: 'British-American film director known for his distinctive style...',
            },
          },
        },
        DirectorList: {
          type: 'object',
          properties: {
            directors: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Director',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 100,
                },
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                pages: {
                  type: 'integer',
                  example: 10,
                },
              },
            },
          },
        },
      },
      parameters: {
        directorId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
          },
          description: 'Director ID',
        },
        page: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description: 'Page number',
        },
        limit: {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: 'Number of items per page',
        },
        sortBy: {
          in: 'query',
          name: 'sortBy',
          schema: {
            type: 'string',
            enum: ['firstName', 'lastName', 'birthDate', 'createdAt', 'updatedAt'],
            default: 'createdAt',
          },
          description: 'Field to sort by',
        },
        sortOrder: {
          in: 'query',
          name: 'sortOrder',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
          },
          description: 'Sort order',
        },
      },
      responses: {
        NotFound: {
          description: 'The specified resource was not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}; 