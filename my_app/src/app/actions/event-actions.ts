'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';
import type { Event } from '@/types/events';

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return {
      success: true as const,
      data: events
    };
  } catch (error) {
    return handlePrismaError(error);
  }
} 