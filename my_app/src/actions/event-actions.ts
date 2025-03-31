'use server';

import { prisma } from '@/lib/prisma';
import { handlePrismaError } from '@/lib/utils/error-handler';

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
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

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id }
    });
    
    return {
      success: true as const,
      data: event
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function addEvent(data: {
  title: string;
  date: Date;
  time: string;
  description: string;
  image: string;
  facebookEventUrl?: string;
  eventTagId?: string;
  isActive?: boolean;
  isPublic?: boolean;
  showPastDate?: boolean;
}) {
  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: new Date(data.date),
        time: data.time,
        description: data.description,
        image: data.image,
        facebookEventUrl: data.facebookEventUrl,
        eventTagId: data.eventTagId,
        isActive: data.isActive ?? true,
        isPublic: data.isPublic ?? true,
        showPastDate: data.showPastDate ?? false
      }
    });
    
    return {
      success: true as const,
      data: event
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function updateEvent(id: string, data: {
  title?: string;
  date?: Date;
  time?: string;
  description?: string;
  image?: string;
  facebookEventUrl?: string;
  eventTagId?: string;
  isActive?: boolean;
  isPublic?: boolean;
  showPastDate?: boolean;
}) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        date: data.date ? new Date(data.date) : undefined,
        time: data.time,
        description: data.description,
        image: data.image,
        facebookEventUrl: data.facebookEventUrl,
        eventTagId: data.eventTagId,
        isActive: data.isActive,
        isPublic: data.isPublic,
        showPastDate: data.showPastDate
      }
    });
    
    return {
      success: true as const,
      data: event
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function deleteEvent(id: string) {
  try {
    await prisma.event.delete({
      where: { id }
    });
    
    return {
      success: true as const
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function getEventTags() {
  try {
    const tags = await prisma.eventTag.findMany();
    
    return {
      success: true as const,
      data: tags
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

interface RegisterAttendanceData {
  name: string;
  email: string;
  guestCount: number;
}

export async function registerEventAttendance(eventId: string, data: RegisterAttendanceData) {
  try {
    const attendance = await prisma.eventAttendee.create({
      data: {
        name: data.name,
        email: data.email,
        eventId,
        guestCount: data.guestCount,
        isRegisteredOnFacebook: false,
        updatedAt: new Date()
      }
    });
    
    return {
      success: true as const,
      data: attendance
    };
  } catch (error) {
    return handlePrismaError(error);
  }
} 