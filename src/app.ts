import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import config from './config/config';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/error-handler';
import { jsonParserErrorHandler } from './middleware/json-parser';
import movieRoutes from './modules/movie/routes/movie.routes';
import directorRoutes from './modules/director/routes/director.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(jsonParserErrorHandler);
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger documentation
if (config.api.swaggerEnabled) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MovieDirectorHub API',
        version: '1.0.0',
        description: 'API for managing movies and directors',
      },
      servers: [
        {
          url: `http://localhost:${config.server.port}${config.api.prefix}`,
          description: 'Development server',
        },
      ],
    },
    apis: [
      './src/modules/**/routes/*.ts',    // development
      './dist/modules/**/routes/*.js',    // production - ts compiled to js
      './src/modules/shared/schemas/*.ts', // schema definitions
      './dist/modules/shared/schemas/*.js' // compiled schema definitions
    ],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// API routes
app.use(`${config.api.prefix}/movies`, movieRoutes);
app.use(`${config.api.prefix}/directors`, directorRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(config.server.port, '0.0.0.0', () => {
      console.log(`Server is running on port ${config.server.port}`);
      console.log(`API Documentation available at http://localhost:${config.server.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});

startServer();
