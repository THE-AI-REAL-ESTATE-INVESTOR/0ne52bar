'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { BusinessInfo, BusinessHours } from '@prisma/client';
import type { ApiResponse } from '@/types/api';

export type BusinessInfoWithHours = BusinessInfo & {
  hours: BusinessHours[];
};

export async function getBusinessInfo(): Promise<ApiResponse<BusinessInfoWithHours>> {
  try {
    const info = await prisma.businessInfo.findFirst({
      include: {
        hours: true
      }
    });

    if (!info) {
      return {
        success: false,
        error: 'Business information not found'
      };
    }

    return {
      success: true,
      data: info
    };
  } catch (error) {
    console.error('Error fetching business info:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to fetch business information'
    };
  }
}

export async function updateBusinessInfo(data: Partial<BusinessInfo>): Promise<ApiResponse<BusinessInfo>> {
  try {
    const info = await prisma.businessInfo.update({
      where: {
        id: data.id
      },
      data
    });

    return {
      success: true,
      data: info
    };
  } catch (error) {
    console.error('Error updating business info:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to update business information'
    };
  }
}

export async function updateBusinessHours(
  businessId: string,
  hours: Omit<BusinessHours, 'id' | 'businessInfoId'>[]
): Promise<ApiResponse<BusinessHours[]>> {
  try {
    // Delete existing hours
    await prisma.businessHours.deleteMany({
      where: {
        businessInfoId: businessId
      }
    });

    // Create new hours
    const newHours = await prisma.businessHours.createMany({
      data: hours.map(hour => ({
        ...hour,
        businessInfoId: businessId
      }))
    });

    const updatedHours = await prisma.businessHours.findMany({
      where: {
        businessInfoId: businessId
      }
    });

    return {
      success: true,
      data: updatedHours
    };
  } catch (error) {
    console.error('Error updating business hours:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to update business hours'
    };
  }
} 