/**
 * Error handling utilities
 * 
 * This file provides standardized error handling for the application.
 */

import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// Error codes
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
  SERVER_ERROR = 'SERVER_ERROR',
}

// Application-specific error class
export class AppError extends Error {
  code: ErrorCode;
  details?: unknown;

  constructor(message: string, code: ErrorCode, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Format Zod validation errors into a user-friendly format
 */
export function formatZodError(error: ZodError): Record<string, string> {
  return error.errors.reduce<Record<string, string>>((acc, curr) => {
    const key = curr.path.join('.');
    acc[key] = curr.message;
    return acc;
  }, {});
}

/**
 * Handle Prisma errors and convert them to AppError
 */
export function handlePrismaError(error: unknown): AppError {
  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] || ['record'];
      return new AppError(
        `A ${target.join(', ')} with this value already exists.`,
        ErrorCode.CONFLICT,
        error
      );
    }
    
    // Record not found
    if (error.code === 'P2025') {
      return new AppError(
        'Record not found.',
        ErrorCode.NOT_FOUND,
        error
      );
    }
    
    // Foreign key constraint failed
    if (error.code === 'P2003') {
      return new AppError(
        'Operation failed due to related records.',
        ErrorCode.CONFLICT,
        error
      );
    }
    
    // Default database error
    return new AppError(
      'A database error occurred.',
      ErrorCode.DATABASE_ERROR,
      error
    );
  }
  
  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError(
      'Invalid data provided.',
      ErrorCode.VALIDATION_ERROR,
      error
    );
  }
  
  // Handle Zod errors
  if (error instanceof ZodError) {
    return new AppError(
      'Validation error.',
      ErrorCode.VALIDATION_ERROR,
      formatZodError(error)
    );
  }
  
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }
  
  // Handle generic errors
  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCode.SERVER_ERROR,
      error
    );
  }
  
  // Handle unknown errors
  return new AppError(
    'An unexpected error occurred.',
    ErrorCode.SERVER_ERROR,
    error
  );
}

/**
 * Create a not found error
 */
export function createNotFoundError(entity: string, id?: string): AppError {
  const message = id 
    ? `${entity} with ID ${id} not found.`
    : `${entity} not found.`;
    
  return new AppError(message, ErrorCode.NOT_FOUND);
}

/**
 * Create an unauthorized error
 */
export function createUnauthorizedError(message = 'Unauthorized'): AppError {
  return new AppError(message, ErrorCode.UNAUTHORIZED);
}

/**
 * Create a forbidden error
 */
export function createForbiddenError(message = 'Forbidden'): AppError {
  return new AppError(message, ErrorCode.FORBIDDEN);
}

/**
 * Create a validation error
 */
export function createValidationError(message = 'Validation error', details?: Record<string, string> | unknown): AppError {
  return new AppError(message, ErrorCode.VALIDATION_ERROR, details);
} 