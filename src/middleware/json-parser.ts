import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const jsonParserErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    throw new ValidationError('Invalid JSON format: ' + err.message);
  }
  next(err);
}; 