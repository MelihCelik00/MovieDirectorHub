/**
 * Base class for custom application errors
 */
export class AppError extends Error {
  constructor(
    public readonly status: string,
    public readonly code: number,
    message: string,
    public readonly path: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      timestamp: new Date().toISOString(),
      path: this.path,
      details: this.details,
    };
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, path: string, details?: any) {
    super('error', 400, message, path, details);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string, path: string) {
    super('error', 404, message, path);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string, path: string) {
    super('error', 409, message, path);
  }
}

/**
 * Database error (500)
 */
export class DatabaseError extends AppError {
  constructor(message: string, path: string, details?: any) {
    super('error', 500, message, path, details);
  }
}

/**
 * Service error (503)
 */
export class ServiceError extends AppError {
  constructor(message: string, path: string) {
    super('error', 503, message, path);
  }
} 