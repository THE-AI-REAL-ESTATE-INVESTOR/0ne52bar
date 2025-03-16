/**
 * Event Actions
 * Server actions for event functionality
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all events
 */
export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { EventTag: true }
    });
    
    return {
      success: true,
      events
    };
  } catch (error) {
    console.error('Error getting events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get event by ID
 */
export async function getEventById(id) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { EventTag: true }
    });
    
    return {
      success: true,
      event
    };
  } catch (error) {
    console.error('Error getting event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Add a new event
 */
export async function addEvent(data) {
  try {
    const event = await prisma.event.create({
      data
    });
    
    return {
      success: true,
      event
    };
  } catch (error) {
    console.error('Error adding event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update an event
 */
export async function updateEvent(id, data) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data
    });
    
    return {
      success: true,
      event
    };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete an event
 */
export async function deleteEvent(id) {
  try {
    await prisma.event.delete({
      where: { id }
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all event tags
 */
export async function getEventTags() {
  try {
    const tags = await prisma.eventTag.findMany();
    
    return {
      success: true,
      tags
    };
  } catch (error) {
    console.error('Error getting event tags:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Register attendance for an event
 */
export async function registerEventAttendance(eventId, data) {
  try {
    const { name, email, guestCount } = data;
    
    const attendance = await prisma.eventAttendee.create({
      data: {
        name,
        email,
        guestCount,
        eventId,
        registeredAt: new Date()
      }
    });
    
    return {
      success: true,
      attendance
    };
  } catch (error) {
    console.error('Error registering event attendance:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
