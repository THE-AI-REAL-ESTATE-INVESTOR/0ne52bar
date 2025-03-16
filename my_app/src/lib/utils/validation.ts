/**
 * Validation utilities
 * 
 * This file provides utilities for validating data using Zod schemas
 * and integrating with server actions.
 */

import { z } from 'zod';
import { createErrorResponse } from './api-response';
import { formatZodError } from './error-handler';

/**
 * Validate data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns A tuple containing [isValid, validatedData, errors]
 */
export function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): [boolean, z.infer<T> | null, Record<string, string> | null] {
  try {
    const validatedData = schema.parse(data);
    return [true, validatedData, null];
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = formatZodError(error);
      return [false, null, formattedErrors];
    }
    throw error;
  }
}

/**
 * Create a validation middleware for server actions
 * @param schema The Zod schema to validate against
 * @param action The server action to execute if validation passes
 * @returns A wrapped server action that validates input data
 */
export function withValidation<T extends z.ZodType, R>(
  schema: T,
  action: (data: z.infer<T>) => Promise<R>
) {
  return async function validatedAction(data: unknown) {
    const [isValid, validatedData, errors] = validateData(schema, data);
    
    if (!isValid || !validatedData) {
      return createErrorResponse(
        'Validation error',
        'VALIDATION_ERROR',
        errors
      );
    }
    
    try {
      const result = await action(validatedData);
      return result;
    } catch (error) {
      console.error('Error in server action:', error);
      
      // If the action already returns an object with success property,
      // assume it's already handling errors
      if (
        typeof error === 'object' && 
        error !== null && 
        'success' in error && 
        error.success === false
      ) {
        return error;
      }
      
      return createErrorResponse(
        error instanceof Error ? error.message : 'An error occurred',
        error instanceof Error ? error.name : 'UnknownError'
      );
    }
  };
}

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[0-9]{10,15}$/,
  url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  cuid: /^c[a-z0-9]{24}$/i,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

/**
 * Common validation helpers
 */
export const validators = {
  id: z.string().min(1, 'ID is required'),
  cuid: z.string().regex(validationPatterns.cuid, 'Invalid ID format'),
  uuid: z.string().uuid('Invalid UUID format'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(validationPatterns.phone, 'Invalid phone number'),
  url: z.string().url('Invalid URL'),
  password: z.string().regex(
    validationPatterns.password,
    'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
  ),
  nonEmptyString: z.string().min(1, 'This field cannot be empty'),
  slug: z.string().regex(validationPatterns.slug, 'Invalid slug format'),
  date: z.string().or(z.date()),
}; 