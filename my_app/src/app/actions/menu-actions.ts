'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { MenuItem, Category, Prisma } from '@prisma/client';
import type { ApiResponse } from '@/types/api';

export type MenuItemWithCategory = MenuItem & {
  category: Category;
};

export async function getMenuItems(): Promise<ApiResponse<MenuItemWithCategory[]>> {
  try {
    // Ensure connection is alive
    await prisma.$connect();
    
    const items = await prisma.menuItem.findMany({
      where: {
        isActive: {
          equals: true
        }
      },
      include: {
        category: true
      },
      orderBy: {
        category: {
          sortOrder: 'asc'
        }
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
  } finally {
    // Always disconnect in production to prevent connection leaks
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        sortOrder: 'asc'
      }
    });

    return {
      success: true,
      data: categories
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

export async function createMenuItem(data: Prisma.MenuItemCreateInput): Promise<ApiResponse<MenuItem>> {
  try {
    const item = await prisma.menuItem.create({
      data
    });

    return {
      success: true,
      data: item
    };
  } catch (error) {
    console.error('Error creating menu item:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to create menu item'
    };
  }
}

export async function updateMenuItem(id: string, data: Prisma.MenuItemUpdateInput): Promise<ApiResponse<MenuItem>> {
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data
    });

    return {
      success: true,
      data: item
    };
  } catch (error) {
    console.error('Error updating menu item:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to update menu item'
    };
  }
}

export async function deleteMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        isActive: {
          set: false
        }
      }
    });

    return {
      success: true,
      data: item
    };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to delete menu item'
    };
  }
} 