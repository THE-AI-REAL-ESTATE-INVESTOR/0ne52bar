'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { Merchandise, MerchandiseCategory } from '@prisma/client';

type MerchandiseWithCategory = Merchandise & {
  category: MerchandiseCategory;
};

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export async function getMerchandise(): Promise<ApiResponse<MerchandiseWithCategory[]>> {
  try {
    const items = await prisma.merchandise.findMany({
      include: {
        category: true
      },
      orderBy: {
        category: {
          name: 'asc'
        }
      }
    });
    
    return {
      success: true as const,
      data: items
    };
  } catch (error) {
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message
    };
  }
}