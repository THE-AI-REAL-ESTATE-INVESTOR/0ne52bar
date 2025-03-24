'use server';

import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, ApiResponse } from '@/lib/utils/api-response';
import { handlePrismaError } from '@/lib/utils/error-handler';
import { createModelActions } from '@/lib/server/action-factory';
import { 
  tapPassFormDataInputSchema,
  TapPassFormData
} from '@/types/tappass';

// Create model actions using factory
const TapPassFormDataActions = createModelActions(
  "TapPassFormData", // Correct Prisma model name
  tapPassFormDataInputSchema,
  tapPassFormDataInputSchema,
  {
    defaultSortField: "id"
  }
);

// Export consolidated actions with correct property names
export const {
  create: createTapPassFormData,
  getById: getTapPassFormData,
  update: updateTapPassFormData,
  remove: deleteTapPassFormData,
  list: listTapPassFormData
} = TapPassFormDataActions; 