/**
 * Shared type definitions for ONE52 Bar & Grill marketing operations
 */

export * from './campaign';
export * from './excel';

/**
 * Common validation error type
 */
export interface ValidationError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Field that caused the error */
  field?: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}

/**
 * Common result type for operations
 */
export interface OperationResult<T> {
  /** Whether the operation was successful */
  success: boolean;
  /** Operation result data */
  data?: T;
  /** Error information if operation failed */
  error?: ValidationError;
  /** Operation metadata */
  metadata?: {
    /** Operation timestamp */
    timestamp: Date;
    /** Operation duration in milliseconds */
    duration: number;
    /** Additional metadata */
    [key: string]: unknown;
  };
} 