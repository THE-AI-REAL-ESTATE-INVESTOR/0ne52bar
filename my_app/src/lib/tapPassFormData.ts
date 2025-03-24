import { z } from 'zod';

export interface TapPassFormData {
  name: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  agreeToTerms: boolean;
}

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  birthday: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 21;
  }, 'Must be at least 21 years old'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms')
});

export type TapPassFormErrors = {
  [K in keyof TapPassFormData]?: string[];
}; 