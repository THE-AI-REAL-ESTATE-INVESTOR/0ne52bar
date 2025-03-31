'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const orderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.string(),
  size: z.string().optional(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema),
  total: z.number(),
  customerName: z.string().optional(),
  phoneNumber: z.string().optional(),
  memberId: z.string().optional(),
});

export async function getMerchOrders() {
  try {
    const orders = await prisma.merchandiseOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      success: true,
      data: orders,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting merchandise orders:', error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function getActiveMerchOrders() {
  try {
    const orders = await prisma.merchandiseOrder.findMany({
      where: {
        OR: [
          { isPaid: false },
          { isPickedUp: false },
        ],
        status: {
          not: 'cancelled'
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return {
      success: true,
      data: orders,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting active merchandise orders:', error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function getMerchOrder(id: string) {
  try {
    const order = await prisma.merchandiseOrder.findUnique({
      where: { id },
      include: {
        member: true,
      },
    });
    
    if (!order) {
      return {
        success: false,
        error: 'Order not found',
      };
    }
    
    return {
      success: true,
      data: order,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error getting merchandise order:', error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function createMerchOrder(formData: FormData) {
  try {
    const items = JSON.parse(formData.get('items') as string);
    const total = parseFloat(formData.get('total') as string);
    const customerName = formData.get('customerName') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const memberId = formData.get('memberId') as string;
    
    const data = {
      items,
      total,
      customerName,
      phoneNumber,
      memberId,
    };

    const result = orderSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0]?.message || 'Invalid order data',
      };
    }

    const order = await prisma.merchandiseOrder.create({
      data: {
        items: result.data.items,
        total: result.data.total,
        customerName: result.data.customerName,
        phoneNumber: result.data.phoneNumber,
        memberId: result.data.memberId,
      },
    });

    revalidatePath('/admin/merchandise/orders');
    
    return {
      success: true,
      data: order,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating merchandise order:', error);
    return {
      success: false,
      error: message,
    };
  }
}

export async function updateMerchOrderStatus(
  id: string,
  updates: {
    isPaid?: boolean;
    isPickedUp?: boolean;
    status?: string;
  }
) {
  try {
    const order = await prisma.merchandiseOrder.update({
      where: { id },
      data: updates,
    });

    revalidatePath('/admin/merchandise/orders');
    
    return {
      success: true,
      data: order,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating merchandise order status:', error);
    return {
      success: false,
      error: message,
    };
  }
} 