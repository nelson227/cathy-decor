// Custom error class
export class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

// Validation error
export class ValidationError extends APIError {
  constructor(message = 'Erreur de validation', errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

// Not found error
export class NotFoundError extends APIError {
  constructor(resource = 'Ressource') {
    super(`${resource} non trouvée`, 404);
  }
}

// Unauthorized error
export class UnauthorizedError extends APIError {
  constructor(message = 'Non autorisé') {
    super(message, 401);
  }
}

// Forbidden error
export class ForbiddenError extends APIError {
  constructor(message = 'Accès refusé') {
    super(message, 403);
  }
}

// Conflict error (duplicate, etc.)
export class ConflictError extends APIError {
  constructor(message = 'Conflit') {
    super(message, 409);
  }
}

// Async handler wrapper - catches errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error response formatter
export const formatErrorResponse = (error) => {
  let status = error.statusCode || 500;
  let message = error.message || 'Erreur interne du serveur';
  let errors = error.errors || [];

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Erreur de validation';
    errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    status = 409;
    message = 'Valeur déjà existante';
    const field = Object.keys(error.keyValue)[0];
    errors = [{ field, message: `${field} déjà utilisé` }];
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    status = 400;
    message = 'Format invalide';
    errors = [{ field: error.path, message: 'Format invalide' }];
  }

  return {
    success: false,
    message,
    statusCode: status,
    ...(errors.length > 0 && { errors })
  };
};

// Logger helper
export const logError = (error, req) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const ip = req.ip;

  console.error(
    `[${timestamp}] Error in ${method} ${path} from ${ip}:`,
    error.message
  );

  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', error.stack);
  }
};
