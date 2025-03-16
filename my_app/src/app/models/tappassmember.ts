import { z } from "zod";

/**
 * Schema for TapPassMember
 */
const TapPassMemberSchema = z.object({
  id: z.string(),
  memberId: z.string().min(1, { message: "Member ID is required" }),
  memberSince: z.string().min(1, { message: "Member since date is required" }),
  tier: z.string().min(1, { message: "Tier is required" }),
  points: z.number().min(0, { message: "Points must be 0 or higher" }),
  visits: z.number().min(0, { message: "Visits must be 0 or higher" }),
  lastVisit: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

const TapPassMemberCreateSchema = TapPassMemberSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

const TapPassMemberUpdateSchema = TapPassMemberSchema.partial().extend({
  id: z.string().min(1, { message: "ID is required" })
});

export type TapPassMember = z.infer<typeof TapPassMemberSchema>;
export type TapPassMemberCreate = z.infer<typeof TapPassMemberCreateSchema>;
export type TapPassMemberUpdate = z.infer<typeof TapPassMemberUpdateSchema>;

export {
  TapPassMemberSchema,
  TapPassMemberCreateSchema,
  TapPassMemberUpdateSchema
}; 