import { prisma } from '@/lib/prisma';
import type { ApiResponse } from '@/types/api';
import type { Order } from '@prisma/client';

export async function getOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      data: orders
    };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return {
      success: false,
      error: 'Failed to fetch orders'
    };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<ApiResponse<Order>> {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return {
      success: false,
      error: 'Failed to update order status'
    };
  }
} 