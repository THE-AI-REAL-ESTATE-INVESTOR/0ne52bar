'use server';

import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, ApiResponse } from '@/lib/utils/api-response';
import { handlePrismaError, createNotFoundError } from '@/lib/utils/error-handler';
import { createModelActions } from '@/lib/server/action-factory';
import { 
  tapPassMemberInputSchema,
  TapPassMember
} from '@/types/tappass';

// Create model actions using factory
const MemberActions = createModelActions(
  "Member", // Correct Prisma model name
  tapPassMemberInputSchema,
  tapPassMemberInputSchema,
  {
    defaultSortField: "joinDate",
    relations: ["visitHistory"]
  }
);

// Export consolidated actions with correct property names
export const {
  create,
  getById,
  update,
  remove,
  list
} = MemberActions;

// Additional TapPass-specific actions
export async function recordVisit(memberId: string): Promise<ApiResponse<TapPassMember>> {
  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        visitCount: { increment: 1 },
        points: { increment: 10 }, // Example: 10 points per visit
        lastVisit: new Date()
      }
    });

    return createSuccessResponse(member);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

export async function generateCard(memberId: string): Promise<ApiResponse<{ cardUrl: string }>> {
  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      const error = createNotFoundError('Member', memberId);
      return createErrorResponse(error.message, error.code);
    }

    // TODO: Implement card generation logic
    const cardUrl = `/api/cards/${memberId}`;

    return createSuccessResponse({ cardUrl });
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
} 