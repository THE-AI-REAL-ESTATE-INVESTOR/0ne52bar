'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { ApiResponse } from '@/types/api';
import type { Category, MenuItemWithCategory } from '@/types/menu';

export async function getActiveMenuItems(): Promise<ApiResponse<MenuItemWithCategory[]>> {
  try {
    const items = await prisma.menuItem.findMany({
      where: {
        isActive: true,
        status: 'AVAILABLE',
        categoryId: {
          not: null
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: [
        {
          category: {
            sortOrder: 'asc'
          }
        },
        {
          name: 'asc'
        }
      ]
    });
    
    // Transform the data to match the MenuItemWithCategory type
    const transformedItems = items.map(item => ({
      ...item,
      description: item.description || undefined,
      category: item.category ? {
        ...item.category,
        description: undefined
      } : undefined
    })) as MenuItemWithCategory[];
    
    return {
      success: true,
      data: transformedItems
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

export async function getActiveCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        items: {
          some: {
            isActive: true,
            status: 'AVAILABLE'
          }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    });

    // Transform the data to match the Category type
    const transformedCategories = categories.map(category => ({
      ...category,
      description: category.description || undefined
    })) as Category[];

    return {
      success: true,
      data: transformedCategories
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to fetch categories'
    };
  }
} 