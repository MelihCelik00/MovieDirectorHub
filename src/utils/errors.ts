export class AppError extends Error {
  public readonly status: string;
  public readonly code: number;
  public readonly timestamp: string;
  public readonly path?: string;
  public readonly details?: any;

  constructor(
    message: string,
    code: number = 500,
    path?: string,
    details?: any
  ) {
    super(message);
    this.status = 'error';
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, path?: string, details?: any) {
    super(message, 400, path, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, path?: string, details?: any) {
    super(message, 404, path, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, path?: string, details?: any) {
    super(message, 409, path, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, path?: string, details?: any) {
    super(message, 500, path, details);
  }
}

export const isOperationalError = (error: Error): boolean => {
  return error instanceof AppError;
};

export const formatError = (error: any): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  // Zod Validation Error
  if (error.name === 'ZodError') {
    return new ValidationError(
      'Validation failed',
      undefined,
      JSON.parse(error.message)
    );
  }

  // MongoDB Validation Error
  if (error.name === 'ValidationError') {
    return new ValidationError(
      'Validation failed',
      error.path,
      Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }))
    );
  }

  // MongoDB Duplicate Key Error
  if (error.code === 11000) {
    return new ConflictError(
      'Duplicate key error',
      error.path,
      { key: error.keyValue }
    );
  }

  // Default to Internal Server Error
  return new AppError(
    error.message || 'Internal Server Error',
    500,
    error.path,
    error.stack
  );
}; 