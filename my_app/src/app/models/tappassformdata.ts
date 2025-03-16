import { z } from "zod";

/**
 * Schema for TapPassFormData
 */
const TapPassFormDataSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  birthday: z.string().min(1, { message: "Birthday is required" }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  agreeToTerms: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

const TapPassFormDataCreateSchema = TapPassFormDataSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

const TapPassFormDataUpdateSchema = TapPassFormDataSchema.partial().extend({
  id: z.string().min(1, { message: "ID is required" })
});

export type TapPassFormData = z.infer<typeof TapPassFormDataSchema>;
export type TapPassFormDataCreate = z.infer<typeof TapPassFormDataCreateSchema>;
export type TapPassFormDataUpdate = z.infer<typeof TapPassFormDataUpdateSchema>;

export {
  TapPassFormDataSchema,
  TapPassFormDataCreateSchema,
  TapPassFormDataUpdateSchema
}; 