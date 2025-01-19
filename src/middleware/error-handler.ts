import { Request, Response, NextFunction } from 'express';
import { formatError, isOperationalError } from '../utils/errors';
import logger from '../config/logger';
import config from '../config/config';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const formattedError = formatError(error);

  // Log error
  if (!isOperationalError(error)) {
    logger.error('Unhandled error:', {
      error: formattedError,
      stack: error.stack,
    });
  } else {
    logger.warn('Operational error:', {
      error: formattedError,
    });
  }

  // Send error response
  const response = {
    status: formattedError.status,
    code: formattedError.code,
    message: formattedError.message,
    timestamp: formattedError.timestamp,
    path: formattedError.path || req.path,
    ...(config.server.nodeEnv === 'development' && {
      details: formattedError.details,
      stack: error.stack,
    }),
  };

  res.status(formattedError.code).json(response);
}; 