/**
 * Server Action Factory
 * 
 * Utility for creating standardized server actions for model CRUD operations.
 * This provides a consistent pattern for database interactions across the application.
 */

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { withValidation } from '@/lib/utils/validation';
import { 
  createSuccessResponse, 
  createPaginatedResponse,
  safeAsync 
} from '@/lib/utils/api-response';
import { 
  createNotFoundError 
} from '@/lib/utils/error-handler';

type PrismaModel = keyof typeof prisma;
type SortOrder = 'asc' | 'desc';
type FilterCondition = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'notIn';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

interface FilterOptions {
  field: string;
  condition: FilterCondition;
  value: unknown;
}

/**
 * Create generic CRUD server actions for a Prisma model
 * @param modelName The name of the Prisma model
 * @param createSchema The Zod schema for create operations
 * @param updateSchema The Zod schema for update operations (should include ID)
 * @param options Additional options for customizing behavior
 * @returns Object containing CRUD server actions
 */
export function createModelActions<
  T extends PrismaModel,
  CreateInput extends z.ZodType,
  UpdateInput extends z.ZodType
>(
  modelName: T,
  createSchema: CreateInput,
  updateSchema: UpdateInput,
  options: {
    defaultSortField?: string;
    defaultSortOrder?: SortOrder;
    defaultPageSize?: number;
    softDelete?: boolean;
    relations?: string[];
  } = {}
) {
  const {
    defaultSortField = 'id',
    defaultSortOrder = 'desc',
    defaultPageSize = 10,
    softDelete = false,
    relations = [],
  } = options;

  const prismaModel = prisma[modelName] as unknown;
  
  if (!prismaModel) {
    throw new Error(`Invalid Prisma model: ${String(modelName)}`);
  }

  // Helper to include relations if specified
  const getInclude = () => {
    if (relations.length === 0) return undefined;
    
    const include: Record<string, boolean> = {};
    relations.forEach(relation => {
      include[relation] = true;
    });
    
    return include;
  };

  /**
   * Create a new record
   */
  const create = withValidation(createSchema, async (data) => {
    return safeAsync(async () => {
      console.log(`💾 DATABASE CREATE - Model: ${String(modelName)}, Data:`, data);
      
      const result = await (prismaModel as any).create({
        data,
        include: getInclude()
      });
      
      console.log(`✅ DATABASE CREATED - Model: ${String(modelName)}, ID: ${result.id}`);
      return createSuccessResponse(result, 'Record created successfully');
    });
  });

  /**
   * Get a record by ID
   */
  const getById = async (id: string) => {
    return safeAsync(async () => {
      console.log(`🔍 DATABASE QUERY - Model: ${String(modelName)}, ID: ${id}`);
      
      const record = await (prismaModel as any).findUnique({
        where: { id },
        include: getInclude()
      });
      
      if (!record) {
        console.log(`❌ DATABASE NOT FOUND - Model: ${String(modelName)}, ID: ${id}`);
        throw createNotFoundError(`${String(modelName)} not found`);
      }
      
      console.log(`✅ DATABASE FOUND - Model: ${String(modelName)}, ID: ${id}`);
      return createSuccessResponse(record);
    });
  };

  /**
   * Update a record
   */
  const update = withValidation(updateSchema, async (data) => {
    return safeAsync(async () => {
      const { id, ...updateData } = data as { id: string; [key: string]: unknown };
      
      console.log(`🔄 DATABASE UPDATE - Model: ${String(modelName)}, ID: ${id}, Data:`, updateData);
      
      // Check if record exists
      const existingRecord = await (prismaModel as any).findUnique({
        where: { id }
      });
      
      if (!existingRecord) {
        console.log(`❌ DATABASE UPDATE FAILED - Model: ${String(modelName)}, ID: ${id} - Record not found`);
        throw createNotFoundError(`${String(modelName)} not found`);
      }
      
      const updatedRecord = await (prismaModel as any).update({
        where: { id },
        data: updateData,
        include: getInclude()
      });
      
      console.log(`✅ DATABASE UPDATED - Model: ${String(modelName)}, ID: ${id}`);
      return createSuccessResponse(updatedRecord, 'Record updated successfully');
    });
  });

  /**
   * Delete a record
   */
  const remove = async (id: string) => {
    return safeAsync(async () => {
      console.log(`🗑️ DATABASE DELETE - Model: ${String(modelName)}, ID: ${id}`);
      
      // Check if record exists
      const existingRecord = await (prismaModel as any).findUnique({
        where: { id }
      });
      
      if (!existingRecord) {
        console.log(`❌ DATABASE DELETE FAILED - Model: ${String(modelName)}, ID: ${id} - Record not found`);
        throw createNotFoundError(`${String(modelName)} not found`);
      }
      
      if (softDelete) {
        // Use soft delete if enabled (assumes model has deletedAt field)
        await (prismaModel as any).update({
          where: { id },
          data: { deletedAt: new Date() }
        });
      } else {
        // Use hard delete
        await (prismaModel as any).delete({
          where: { id }
        });
      }
      
      console.log(`✅ DATABASE DELETED - Model: ${String(modelName)}, ID: ${id}`);
      return createSuccessResponse(null, 'Record deleted successfully');
    });
  };

  /**
   * List records with pagination and filtering
   */
  const list = async (
    options?: PaginationOptions,
    filters?: FilterOptions[]
  ) => {
    return safeAsync(async () => {
      const {
        page = 1,
        pageSize = defaultPageSize,
        sortBy = defaultSortField,
        sortOrder = defaultSortOrder
      } = options || {};
      
      console.log(`📋 DATABASE LIST - Model: ${String(modelName)}, Page: ${page}, PageSize: ${pageSize}`);
      
      // Build where clause from filters
      const where: Record<string, unknown> = {};
      
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          where[filter.field] = {
            [filter.condition]: filter.value
          };
        });
        console.log(`🔍 DATABASE LIST FILTERS - Model: ${String(modelName)}`, filters);
      }
      
      // If using soft delete, only show non-deleted records
      if (softDelete) {
        where.deletedAt = null;
      }
      
      // Get total count for pagination
      const total = await (prismaModel as any).count({ where });
      
      // Calculate skip and take for pagination
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      
      // Build order by object
      const orderBy: Record<string, string> = {
        [sortBy]: sortOrder
      };
      
      // Get records
      const records = await (prismaModel as any).findMany({
        where,
        orderBy,
        skip,
        take,
        include: getInclude()
      });
      
      const totalPages = Math.ceil(total / pageSize);
      
      console.log(`✅ DATABASE LIST RESULTS - Model: ${String(modelName)}, Found: ${records.length}, Total: ${total}`);
      
      return createPaginatedResponse(
        records,
        {
          total,
          page,
          pageSize,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        'Records retrieved successfully'
      );
    });
  };

  return {
    create,
    getById,
    update,
    remove,
    list
  };
} 