import { z } from 'zod';

/**
 * Schema for TapPass member registration
 */
export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

/**
 * Schema for TapPass member update
 */
export const memberUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format').optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  membershipLevel: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).optional(),
  points: z.number().min(0).optional()
}); 