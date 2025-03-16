'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { MenuItem } from '@prisma/client';

export async function getMenuItems() {
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
    return handlePrismaError(error);
  }
} 