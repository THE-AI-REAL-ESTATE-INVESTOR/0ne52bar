'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { ApiResponse } from '@/types/api';
import type { Order, Member } from '@prisma/client';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CreateOrderParams {
  items: OrderItem[];
  total: number;
  memberId?: string;
  phoneNumber: string;
  customerName: string;
  marketingConsent?: boolean;
}

const POINTS_PER_ORDER = 25; // Fixed points per order

export async function createOrder({ 
  items, 
  total, 
  memberId, 
  phoneNumber, 
  customerName,
  marketingConsent = false 
}: CreateOrderParams) {
  try {
    // First, find or create the customer
    let customer = await prisma.customer.findUnique({
      where: { phoneNumber }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phoneNumber,
          marketingConsent,
          orderCount: 0,
          firstOrder: null,
          lastOrder: null
        }
      });
    }

    // If we have a memberId, verify it belongs to this customer
    let member = null;
    if (memberId) {
      member = await prisma.member.findFirst({
        where: {
          memberId,
          customerId: customer.id
        }
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        total,
        status: 'PENDING',
        memberId: member?.id,
        customerId: customer.id,
        phoneNumber,
        customerName,
        marketingConsent,
        points: member ? POINTS_PER_ORDER : 0, // Only award points to members
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes
        }))
      },
      include: {
        member: true,
        customer: true
      }
    });

    // Update customer stats
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        orderCount: {
          increment: 1
        },
        lastOrder: new Date(),
        firstOrder: customer.firstOrder || new Date()
      }
    });

    // If this is a member order, update their points
    if (member) {
      await prisma.member.update({
        where: { id: member.id },
        data: {
          points: {
            increment: POINTS_PER_ORDER
          },
          visitCount: {
            increment: 1
          },
          lastVisit: new Date()
        }
      });
    }

    // Revalidate the orders page to show the new order
    revalidatePath('/admin/menu/orders');

    return { success: true, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

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

export async function getActiveOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'PREPARING', 'READY']
        }
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
    console.error('Failed to fetch active orders:', error);
    return {
      success: false,
      error: 'Failed to fetch active orders'
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

    // Revalidate the orders page
    revalidatePath('/admin/menu/orders');

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

export async function updateOrder(
  orderId: string,
  data: Partial<Order>
): Promise<ApiResponse<Order>> {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data
    });

    // Revalidate the orders page
    revalidatePath('/admin/menu/orders');

    return {
      success: true,
      data: order
    };
  } catch (error) {
    console.error('Failed to update order:', error);
    return {
      success: false,
      error: 'Failed to update order'
    };
  }
}

interface OrderWithMember extends Order {
  member: Member | null;
  items: OrderItem[] | string;
}

export async function getOrder(orderId: string): Promise<ApiResponse<OrderWithMember>> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        member: true
      }
    });

    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      };
    }

    return {
      success: true,
      data: order as OrderWithMember
    };
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return {
      success: false,
      error: 'Failed to fetch order'
    };
  }
} 