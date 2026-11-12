import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  console.error(`[API Error] ${code} (${statusCode}):`, err);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.isProduction ? {} : { stack: err.stack, details: err.details }),
    },
  });
};

