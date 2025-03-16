'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { MenuItem } from '@prisma/client';

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export async function getMenuItems(): Promise<ApiResponse<MenuItem[]>> {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: {
        category: 'asc'
      }
    });
    
    return {
      success: true as const,
      data: items
    };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to fetch menu items'
    };
  }
} 