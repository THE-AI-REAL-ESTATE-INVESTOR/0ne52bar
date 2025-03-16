"use server";

import { 
  TapPassFormDataCreateSchema, 
  TapPassFormDataUpdateSchema 
} from "@/app/models/tappassformdata";
import { createModelActions } from "@/lib/server/action-factory";

/**
 * Server actions for TapPassFormData
 */
const TapPassFormDataActions = createModelActions(
  "tapPassFormData", // Prisma model name (camelCase)
  TapPassFormDataCreateSchema,
  TapPassFormDataUpdateSchema,
  {
    defaultSortField: "updatedAt",
    relations: [] // Add relation names if needed
  }
);

export const createTapPassFormData = TapPassFormDataActions.create;
export const getTapPassFormData = TapPassFormDataActions.getById;
export const updateTapPassFormData = TapPassFormDataActions.update;
export const deleteTapPassFormData = TapPassFormDataActions.remove;
export const listTapPassFormData = TapPassFormDataActions.list; 