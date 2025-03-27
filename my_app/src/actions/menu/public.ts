'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { ApiResponse } from '@/types/api';
import type { MenuItem, Category, Order, OrderItem } from '@/types/menu';
import { z } from 'zod';

// Validation schemas
const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().min(1)
});

const orderSchema = z.object({
  memberId: z.string().optional(),
  items: z.array(orderItemSchema),
  total: z.number().min(0)
});

export async function getActiveMenuItems(): Promise<ApiResponse<MenuItem[]>> {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected to database');
    
    console.log('Fetching menu items...');
    const items = await prisma.menuItem.findMany({
      where: {
        isActive: true,
        status: 'AVAILABLE'
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
    console.log('Fetched items:', items);
    
    return {
      success: true,
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
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

export async function getActiveCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        items: {
          some: {
            isActive: true
          }
        }
      },
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

export async function createOrder(data: z.infer<typeof orderSchema>): Promise<ApiResponse<Order>> {
  try {
    const validatedData = orderSchema.parse(data);
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        memberId: validatedData.memberId,
        items: validatedData.items,
        total: validatedData.total,
        status: 'pending'
      }
    });

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Error creating order:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to create order'
    };
  }
}

export async function getOrderHistory(memberId: string): Promise<ApiResponse<Order[]>> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        memberId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      data: orders
    };
  } catch (error) {
    console.error('Error fetching order history:', error);
    const { message } = handlePrismaError(error);
    return {
      success: false,
      error: message || 'Failed to fetch order history'
    };
  }
} 