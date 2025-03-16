/**
 * Standardized API response utility
 * 
 * This file provides a consistent response format for all server actions
 * and API endpoints in the application.
 */

// Generic success response type
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

// Generic error response type
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

// Union type for all possible responses
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Pagination metadata
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T, 
  meta?: Record<string, any>,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
    ...(message ? { message } : {})
  };
}

/**
 * Create an error response
 */
export function createErrorResponse(
  message: string,
  code: string = 'ERROR',
  details?: unknown
): ErrorResponse {
  return {
    success: false,
    error: {
      message,
      code,
      ...(details ? { details } : {})
    }
  };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  currentPage: number,
  pageSize: number,
  message?: string
): SuccessResponse<T[]> {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    success: true,
    data,
    meta: {
      pagination: {
        currentPage,
        pageSize,
        totalItems,
        totalPages
      }
    },
    ...(message ? { message } : {})
  };
}

/**
 * Safely handle async operations in server actions
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<ApiResponse<T>> {
  try {
    const data = await fn();
    return createSuccessResponse(data);
  } catch (error) {
    console.error('API Error:', error);
    if (error && typeof error === 'object' && 'code' in error) {
      return createErrorResponse(
        error instanceof Error ? error.message : errorMessage,
        String(error.code),
        process.env.NODE_ENV === 'development' ? error : undefined
      );
    }
    
    return createErrorResponse(
      error instanceof Error ? error.message : errorMessage,
      'ERROR',
      process.env.NODE_ENV === 'development' ? error : undefined
    );
  }
} 