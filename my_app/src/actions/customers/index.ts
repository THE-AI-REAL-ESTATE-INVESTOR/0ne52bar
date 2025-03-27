'use server';

import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types/api';
import type { Prisma, MembershipLevel } from '@prisma/client';

type OrderWithMember = Prisma.OrderGetPayload<{
  include: { member: true }
}>;

type MemberWithOrders = Prisma.MemberGetPayload<{
  include: { orders: true }
}>;

export interface CustomerResponse {
  id: string;
  name: string;
  phoneNumber: string;
  type: 'member' | 'non-member';
  orders: OrderWithMember[];
  memberDetails?: {
    memberId: string;
    points: number;
    visits: number;
    lastVisit: Date | null;
    membershipLevel: MembershipLevel;
  };
}

export async function getCustomer(customerId: string): Promise<ApiResponse<CustomerResponse>> {
  try {
    // First try to find as member
    const member = await prisma.member.findUnique({
      where: { id: customerId },
      include: { orders: true },
    }) as MemberWithOrders | null;

    if (member) {
      return {
        success: true,
        data: {
          id: member.id,
          name: member.name,
          phoneNumber: member.phoneNumber,
          type: 'member',
          orders: member.orders,
          memberDetails: {
            memberId: member.memberId,
            points: member.points,
            visits: member.visitCount,
            lastVisit: member.lastVisit,
            membershipLevel: member.membershipLevel,
          },
        },
      };
    }

    // If not a member, find by order history
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerName: customerId },
          { phoneNumber: customerId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { member: true },
    }) as OrderWithMember[];

    if (orders.length > 0) {
      const firstOrder = orders[0];
      return {
        success: true,
        data: {
          id: `${firstOrder.phoneNumber}-${firstOrder.customerName}`,
          name: firstOrder.customerName,
          phoneNumber: firstOrder.phoneNumber,
          type: 'non-member',
          orders,
        },
      };
    }

    return {
      success: false,
      error: 'Customer not found',
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return {
      success: false,
      error: 'Failed to fetch customer details',
    };
  }
}

export async function getCustomers(search?: { name?: string; phone?: string }): Promise<ApiResponse<CustomerResponse[]>> {
  try {
    // Get all members with their orders
    const members = await prisma.member.findMany({
      where: {
        OR: [
          search?.name ? { name: { contains: search.name, mode: 'insensitive' } } : {},
          search?.phone ? { phoneNumber: { contains: search.phone, mode: 'insensitive' } } : {},
        ],
      },
      include: { orders: true },
    }) as MemberWithOrders[];

    // Get non-member orders
    const nonMemberOrders = await prisma.order.findMany({
      where: {
        AND: [
          { memberId: null },
          {
            OR: [
              search?.name ? { customerName: { contains: search.name, mode: 'insensitive' } } : {},
              search?.phone ? { phoneNumber: { contains: search.phone, mode: 'insensitive' } } : {},
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { member: true },
    }) as OrderWithMember[];

    // Convert members to CustomerResponse format
    const memberCustomers: CustomerResponse[] = members.map((member) => ({
      id: member.id,
      name: member.name,
      phoneNumber: member.phoneNumber,
      type: 'member',
      orders: member.orders,
      memberDetails: {
        memberId: member.memberId,
        points: member.points,
        visits: member.visitCount,
        lastVisit: member.lastVisit,
        membershipLevel: member.membershipLevel,
      },
    }));

    // Group non-member orders by customer (phone + name)
    const orderMap = new Map<string, CustomerResponse>();
    
    nonMemberOrders.forEach((order: OrderWithMember) => {
      const key = `${order.phoneNumber}-${order.customerName}`;
      if (!orderMap.has(key)) {
        orderMap.set(key, {
          id: key,
          name: order.customerName,
          phoneNumber: order.phoneNumber,
          type: 'non-member',
          orders: [],
        });
      }
      const customer = orderMap.get(key)!;
      customer.orders.push(order);
    });

    const nonMemberCustomers = Array.from(orderMap.values());

    return {
      success: true,
      data: [...memberCustomers, ...nonMemberCustomers],
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      error: 'Failed to fetch customers',
    };
  }
} 