import { z } from 'zod';

// Base schemas
export const tapPassMemberSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  birthday: z.date(),
  agreeToTerms: z.boolean(),
  membershipLevel: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']),
  joinDate: z.date(),
  points: z.number().int().min(0),
  visits: z.number().int().min(0),
  lastVisit: z.date().nullable(),
  visitHistory: z.array(z.any()) // We'll define Visit type if needed
});

export const tapPassFormDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  birthday: z.string(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  agreeToTerms: z.boolean()
});

// Input types (for create/update operations)
export const tapPassMemberInputSchema = tapPassMemberSchema.omit({
  id: true,
  memberId: true,
  joinDate: true,
  points: true,
  visits: true,
  lastVisit: true,
  visitHistory: true
});

export const tapPassFormDataInputSchema = tapPassFormDataSchema.omit({
  id: true
});

// TypeScript types
export type TapPassMember = z.infer<typeof tapPassMemberSchema>;
export type TapPassMemberInput = z.infer<typeof tapPassMemberInputSchema>;
export type TapPassFormData = z.infer<typeof tapPassFormDataSchema>;
export type TapPassFormDataInput = z.infer<typeof tapPassFormDataInputSchema>;
export type TapPassStatus = TapPassMember['membershipLevel'];
export type TapPassTier = TapPassMember['membershipLevel'];

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  meta?: {
    pagination?: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
} 