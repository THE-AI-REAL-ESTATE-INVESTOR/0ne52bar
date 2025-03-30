'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';

/**
 * Get all events (for /events page)
 */
export async function getAllEvents() {
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

/**
 * Get upcoming events and last 5 events (for home page)
 */
export async function getHomePageEvents() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get upcoming events
    const upcomingEvents = await prisma.event.findMany({
      where: {
        isActive: true,
        date: {
          gte: today
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Get last 5 past events
    const pastEvents = await prisma.event.findMany({
      where: {
        isActive: true,
        date: {
          lt: today
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 5
    });
    
    return {
      success: true as const,
      data: {
        upcomingEvents,
        pastEvents
      }
    };
  } catch (error) {
    return handlePrismaError(error);
  }
} 