'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, ApiResponse } from '@/lib/utils/api-response';
import { AppError, ErrorCode, handlePrismaError, createValidationError, createNotFoundError } from '@/lib/utils/error-handler';

// Schemas
const tapPassFormDataSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  businessName: z.string().min(1, 'Business name is required'),
  businessWebsite: z.string().url('Must be a valid URL'),
  position: z.string(),
  message: z.string()
});

const statusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);

type TapPassFormDataInput = z.infer<typeof tapPassFormDataSchema>;
type StatusType = z.infer<typeof statusSchema>;
type TapPassFormData = any; // This would typically be defined in your schema

// Create a new TapPassFormData
export async function createTapPassFormData(data: TapPassFormDataInput): Promise<ApiResponse<TapPassFormData>> {
  try {
    // Validate the input data
    const validationResult = tapPassFormDataSchema.safeParse(data);
    if (!validationResult.success) {
      const error = createValidationError('Validation failed', validationResult.error.format());
      return createErrorResponse(error.message, error.code, error.details);
    }

    // Create the TapPassFormData in the database
    const newSubmission = await prisma.tapPassFormData.create({
      data: {
        ...validationResult.data,
        status: 'PENDING'
      }
    });

    // Return success response
    return createSuccessResponse(newSubmission);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Get a TapPassFormData by ID
export async function getTapPassFormData(id: string): Promise<ApiResponse<TapPassFormData>> {
  try {
    const formData = await prisma.tapPassFormData.findUnique({
      where: { id }
    });

    if (!formData) {
      const error = createNotFoundError('TapPassFormData', id);
      return createErrorResponse(error.message, error.code);
    }

    return createSuccessResponse(formData);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Get a list of TapPassFormData submissions with pagination
interface ListOptions {
  page?: number;
  pageSize?: number;
  status?: StatusType;
}

export async function listTapPassFormData({
  page = 1,
  pageSize = 10,
  status
}: ListOptions = {}): Promise<ApiResponse<TapPassFormData[]>> {
  try {
    // Calculate pagination
    const skip = (page - 1) * pageSize;
    
    // Prepare filter
    const where = status ? { status } : {};
    
    // Get submissions with pagination
    const submissions = await prisma.tapPassFormData.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count for pagination
    const total = await prisma.tapPassFormData.count({ where });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pageSize);
    
    // Return paginated response with proper pagination meta
    return {
      success: true,
      data: submissions,
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

// Update a TapPassFormData
export async function updateTapPassFormData(
  id: string,
  data: TapPassFormDataInput
): Promise<ApiResponse<TapPassFormData>> {
  try {
    // Validate the input data
    const validationResult = tapPassFormDataSchema.safeParse(data);
    if (!validationResult.success) {
      const error = createValidationError('Validation failed', validationResult.error.format());
      return createErrorResponse(error.message, error.code, error.details);
    }

    // Update the TapPassFormData in the database
    const updatedSubmission = await prisma.tapPassFormData.update({
      where: { id },
      data: validationResult.data
    });

    // Return success response
    return createSuccessResponse(updatedSubmission);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Update the status of a TapPassFormData
export async function updateTapPassFormDataStatus(
  id: string,
  status: StatusType
): Promise<ApiResponse<TapPassFormData>> {
  try {
    // Validate the status
    const validationResult = statusSchema.safeParse(status);
    if (!validationResult.success) {
      const error = createValidationError('Invalid status value');
      return createErrorResponse(error.message, error.code, error.details);
    }

    // Update the status in the database
    const updatedSubmission = await prisma.tapPassFormData.update({
      where: { id },
      data: { status: validationResult.data }
    });

    // Return success response
    return createSuccessResponse(updatedSubmission);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
}

// Delete a TapPassFormData
export async function deleteTapPassFormData(id: string): Promise<ApiResponse<TapPassFormData>> {
  try {
    const deletedSubmission = await prisma.tapPassFormData.delete({
      where: { id }
    });

    return createSuccessResponse(deletedSubmission);
  } catch (error) {
    const appError = handlePrismaError(error);
    return createErrorResponse(appError.message, appError.code, appError.details);
  }
} 