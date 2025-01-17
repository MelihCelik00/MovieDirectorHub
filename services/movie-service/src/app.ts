import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { swaggerOptions } from './config/swagger';
import { errorHandler } from './middleware/error-handler';
import { MovieController } from './controllers/movie.controller';
import { MovieService } from './services/movie.service';
import { MovieRepository } from './repositories/movie.repository';
import { createMovieRouter } from './routes/movie.routes';

/**
 * Create Express application
 */
export function createApp() {
  const app = express();

  // Middleware
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }));
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(morgan(config.isDevelopment ? 'dev' : 'combined'));
  app.use(express.json());

  // Dependencies
  const movieRepository = new MovieRepository();
  const movieService = new MovieService(movieRepository);
  const movieController = new MovieController(movieService);

  // Routes
  app.use(`${config.api.prefix}/movies`, createMovieRouter(movieController));

  // Swagger documentation
  if (config.isDevelopment) {
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use(
      `${config.api.prefix}/docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec)
    );
  }

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Movie service is healthy',
      timestamp: new Date().toISOString(),
      path: '/health',
    });
  });

  // Error handling
  app.use(errorHandler);

  return app;
} 