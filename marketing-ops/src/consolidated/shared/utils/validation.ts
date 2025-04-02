import { z } from 'zod';
import { ValidationError } from '../types';
import { VALIDATION } from '../config/constants';

/**
 * Validates a number is within a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  field: string
): ValidationError | null {
  if (value < min) {
    return {
      code: 'VALUE_TOO_LOW',
      message: `${field} must be at least ${min}`,
      field,
      details: { value, min, max },
    };
  }
  if (value > max) {
    return {
      code: 'VALUE_TOO_HIGH',
      message: `${field} must be at most ${max}`,
      field,
      details: { value, min, max },
    };
  }
  return null;
}

/**
 * Validates a campaign budget
 */
export function validateBudget(budget: number): ValidationError | null {
  return validateRange(
    budget,
    VALIDATION.minBudget,
    VALIDATION.maxBudget,
    'budget'
  );
}

/**
 * Validates a conversion rate
 */
export function validateConversionRate(
  rate: number
): ValidationError | null {
  return validateRange(
    rate,
    VALIDATION.minConversionRate,
    VALIDATION.maxConversionRate,
    'conversionRate'
  );
}

/**
 * Validates a customer lifetime value
 */
export function validateCustomerLifetimeValue(
  value: number
): ValidationError | null {
  return validateRange(
    value,
    VALIDATION.minCustomerLifetimeValue,
    VALIDATION.maxCustomerLifetimeValue,
    'customerLifetimeValue'
  );
}

/**
 * Validates a target audience size
 */
export function validateTargetAudience(
  size: number
): ValidationError | null {
  return validateRange(
    size,
    VALIDATION.minTargetAudience,
    VALIDATION.maxTargetAudience,
    'targetAudience'
  );
}

/**
 * Validates a date range
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date
): ValidationError | null {
  if (startDate > endDate) {
    return {
      code: 'INVALID_DATE_RANGE',
      message: 'Start date must be before end date',
      field: 'dateRange',
      details: { startDate, endDate },
    };
  }
  return null;
}

/**
 * Validates an object against a Zod schema
 */
export function validateSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): ValidationError | null {
  try {
    schema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        code: 'SCHEMA_VALIDATION_ERROR',
        message: firstError.message,
        field: firstError.path.join('.'),
        details: { errors: error.errors },
      };
    }
    return {
      code: 'UNKNOWN_VALIDATION_ERROR',
      message: 'An unknown validation error occurred',
      details: { error },
    };
  }
} 