"use server";

import { createModelActions } from "@/lib/server/action-factory";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSuccessResponse, safeAsync } from "@/lib/utils/api-response";
import { createNotFoundError } from "@/lib/utils/error-handler";

/**
 * Membership Level Enum
 * Defines the different tiers of membership available
 * Used across both Member and TapPassMember models
 */
const MembershipLevels = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;

/**
 * Main Member Schema
 * This is the primary member model in the database
 * Used for core member data and relationships
 * 
 * Key differences from TapPassMember:
 * - Has direct relationships with visits and rewards
 * - Contains more detailed member information
 * - Used for all member operations
 * 
 * Key differences from TapPassFormData:
 * - Contains system-generated fields (id, memberId, timestamps)
 * - Has relationships to other models
 * - Used for database operations
 */
const MemberSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  birthday: z.date(),
  agreeToTerms: z.boolean(),
  membershipLevel: z.enum(MembershipLevels),
  joinDate: z.date(),
  points: z.number(),
  visitCount: z.number(),
  lastVisit: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  visits: z.array(z.any()),
  rewards: z.array(z.any())
});

/**
 * Member Creation Schema
 * Used when creating a new member
 * 
 * Key differences from MemberSchema:
 * - Omits system-generated fields (id, timestamps)
 * - Omits relationship fields (visits, rewards)
 * - Includes memberId generation logic
 * 
 * Key differences from TapPassFormData:
 * - Contains additional fields required for member creation
 * - Uses proper date types instead of strings
 * - Includes membership level
 */
const MemberCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  birthday: z.date(),
  agreeToTerms: z.boolean(),
  membershipLevel: z.enum(MembershipLevels),
  joinDate: z.date(),
  memberId: z.string().default(() => `TAP${Date.now()}`) // Generate unique memberId
});

/**
 * Member Update Schema
 * Used when updating an existing member
 * 
 * Key differences from MemberCreateSchema:
 * - All fields are optional (partial)
 * - Requires id field
 * - Can update any member field
 */
const MemberUpdateSchema = MemberSchema.partial().extend({
  id: z.string()
});

/**
 * Server actions for Member model
 * Uses the action factory to create CRUD operations
 * 
 * Note: Model name must match Prisma schema exactly ("Member")
 * This is different from TapPassMember which uses camelCase
 */
const MemberActions = createModelActions(
  "Member" as keyof typeof prisma,
  MemberCreateSchema,
  MemberUpdateSchema,
  {
    defaultSortField: "updatedAt",
    relations: ["visits", "rewards"]
  }
);

export const createMember = MemberActions.create;
export const getMember = MemberActions.getById;
export const updateMember = MemberActions.update;
export const deleteMember = MemberActions.remove;
export const listMembers = MemberActions.list;

/**
 * Find a member by email
 * Custom action for email-based member lookup
 * 
 * Note: This is separate from the standard CRUD operations
 * because it uses a different unique identifier (email)
 */
export const getMemberByEmail = async (email: string) => {
  return safeAsync(async () => {
    console.log(`🔍 DATABASE QUERY - Model: Member, Email: ${email}`);
    
    const record = await prisma.member.findUnique({
      where: { email },
      include: {
        visits: true,
        rewards: true
      }
    });
    
    if (!record) {
      console.log(`❌ DATABASE NOT FOUND - Model: Member, Email: ${email}`);
      throw createNotFoundError('Member not found');
    }
    
    console.log(`✅ DATABASE FOUND - Model: Member, Email: ${email}`);
    return createSuccessResponse(record);
  });
}; 