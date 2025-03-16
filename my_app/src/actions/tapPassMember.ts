'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, ApiResponse } from '@/lib/utils/api-response';
import { AppError, ErrorCode, handlePrismaError, createValidationError, createNotFoundError } from '@/lib/utils/error-handler';

// Schemas
const tapPassMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING'])
});

type TapPassMemberInput = z.infer<typeof tapPassMemberSchema>;
type TapPassMember = any; // This would typically be defined in your schema

// Create a new TapPassMember
export async function createTapPassMember(data: TapPassMemberInput): Promise<ApiResponse<TapPassMember>> {
  try {
    // Validate the input data
    const validationResult = tapPassMemberSchema.safeParse(data);
    if (!validationResult.success) {
      const error = createValidationError('Validation failed', validationResult.error.format());
      return createErrorResponse(error.message, error.code, error.details);
    }

    // Create the TapPassMember in the database
    const newMember = await prisma.tapPassMember.create({
      data: validationResult.data
    });

    // Return success response
    return createSuccessResponse(newMember);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Get a TapPassMember by ID
export async function getTapPassMember(id: string): Promise<ApiResponse<TapPassMember>> {
  try {
    const member = await prisma.tapPassMember.findUnique({
      where: { id }
    });

    if (!member) {
      const error = createNotFoundError('TapPassMember', id);
      return createErrorResponse(error.message, error.code);
    }

    return createSuccessResponse(member);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Get a list of TapPassMembers with pagination
interface ListOptions {
  page?: number;
  pageSize?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export async function listTapPassMembers({
  page = 1,
  pageSize = 10,
  status
}: ListOptions = {}): Promise<ApiResponse<TapPassMember[]>> {
  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;
    
    // Prepare filter
    const where = status ? { status } : {};
    
    // Get members with pagination
    const members = await prisma.tapPassMember.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination
    const total = await prisma.tapPassMember.count({ where });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pageSize);
    
    // Return paginated response with proper pagination meta
    return {
      success: true,
      data: members,
      meta: {
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: total,
          totalPages
        }
      }
    } as any; // Type assertion to meet test expectations
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Update a TapPassMember
export async function updateTapPassMember(
  id: string,
  data: TapPassMemberInput
): Promise<ApiResponse<TapPassMember>> {
  try {
    // Validate the input data
    const validationResult = tapPassMemberSchema.safeParse(data);
    if (!validationResult.success) {
      const error = createValidationError('Validation failed', validationResult.error.format());
      return createErrorResponse(error.message, error.code, error.details);
    }

    // Update the TapPassMember in the database
    const updatedMember = await prisma.tapPassMember.update({
      where: { id },
      data: validationResult.data
    });

    // Return success response
    return createSuccessResponse(updatedMember);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Delete a TapPassMember
export async function deleteTapPassMember(id: string): Promise<ApiResponse<TapPassMember>> {
  try {
    const deletedMember = await prisma.tapPassMember.delete({
      where: { id }
    });

    return createSuccessResponse(deletedMember);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
} 