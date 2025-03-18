'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { MenuItem, Category, Prisma } from '@prisma/client';
import type { ApiResponse } from '@/types/api';
import { z } from 'zod';

export type MenuItemWithCategory = MenuItem & {
  category: Category;
};

// Validation schemas
const menuItemSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(100)
});

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.number().default(100)
});

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

export async function createMenuItem(data: z.infer<typeof menuItemSchema>): Promise<ApiResponse<MenuItem>> {
  try {
    const validatedData = menuItemSchema.parse(data);
    const item = await prisma.menuItem.create({
      data: validatedData,
      include: {
        category: true
      }
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

export async function updateMenuItem(id: string, data: Partial<z.infer<typeof menuItemSchema>>): Promise<ApiResponse<MenuItem>> {
  try {
    const validatedData = menuItemSchema.partial().parse(data);
    const item = await prisma.menuItem.update({
      where: { id },
      data: validatedData,
      include: {
        category: true
      }
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

export async function createCategory(data: z.infer<typeof categorySchema>): Promise<ApiResponse<Category>> {
  try {
    const validatedData = categorySchema.parse(data);
    const category = await prisma.category.create({
      data: validatedData
    });

    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error('Error creating category:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to create category'
    };
  }
}

export async function updateCategory(id: string, data: Partial<z.infer<typeof categorySchema>>): Promise<ApiResponse<Category>> {
  try {
    const validatedData = categorySchema.partial().parse(data);
    const category = await prisma.category.update({
      where: { id },
      data: validatedData
    });

    return {
      success: true,
      data: category
    };
  } catch (error) {
    console.error('Error updating category:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to update category'
    };
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
  try {
    await prisma.category.delete({
      where: { id }
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to delete category'
    };
  }
} 