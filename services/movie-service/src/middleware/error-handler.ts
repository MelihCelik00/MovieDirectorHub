import { Request, Response, NextFunction } from 'express';
import { AppError } from '@movie-director-hub/shared';
import { ZodError } from 'zod';

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  // Handle AppError instances
  if (error instanceof AppError) {
    return res.status(error.code).json(error.toJSON());
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Validation error',
      timestamp: new Date().toISOString(),
      path: req.path,
      details: error.errors,
    });
  }

  // Handle other errors
  console.error('Unhandled error:', error);
  
  return res.status(500).json({
    status: 'error',
    code: 500,
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
} 