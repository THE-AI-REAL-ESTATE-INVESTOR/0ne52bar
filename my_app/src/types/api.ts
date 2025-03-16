/**
 * Shared API response types
 * Used for consistent server action responses across the application
 */

/**
 * Generic API response type for server actions
 * @template T The type of data returned on success
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Error response from server actions
 */
export interface ApiError {
  success: false;
  error: string;
}

/**
 * Success response from server actions
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
} 