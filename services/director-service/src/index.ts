import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
const rateLimit = require('express-rate-limit');
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { config } from './config';
import { createDirectorRouter } from './routes/director.routes';
import { swaggerOptions } from './config/swagger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.api.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use(`${config.api.prefix}/directors`, createDirectorRouter());

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    
    // Start server
    app.listen(config.server.port, () => {
      console.log(`Director service is running on port ${config.server.port} in ${config.server.nodeEnv} mode`);
      console.log('API documentation available at /api/v1/docs');
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 