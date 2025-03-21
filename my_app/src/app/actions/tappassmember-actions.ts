"use server";

import { 
  TapPassMemberSchema, 
  TapPassMemberCreateSchema, 
  TapPassMemberUpdateSchema 
} from "@/app/models/tappassmember";
import { createModelActions } from "@/lib/server/action-factory";

/**
 * Server actions for TapPassMember
 */
const TapPassMemberActions = createModelActions(
  "tapPassMember", // Prisma model name (camelCase)
  TapPassMemberCreateSchema,
  TapPassMemberUpdateSchema,
  {
    defaultSortField: "updatedAt",
    relations: [] // Add relation names if needed
  }
);

export const createTapPassMember = TapPassMemberActions.create;
export const getTapPassMember = TapPassMemberActions.getById;
export const updateTapPassMember = TapPassMemberActions.update;
export const deleteTapPassMember = TapPassMemberActions.remove;
export const listTapPassMembers = TapPassMemberActions.list; 