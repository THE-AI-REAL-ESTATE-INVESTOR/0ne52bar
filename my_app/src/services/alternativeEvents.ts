import { Event } from '@/types/events';
import { getEvents, getEventById, addEvent as addEventAction, updateEvent as updateEventAction, deleteEvent as deleteEventAction } from '@/actions/event-actions';

/**
 * Transform Prisma Event to application Event type
 */
function transformPrismaEvent(prismaEvent: any): Event {
  return {
    id: prismaEvent.id,
    title: prismaEvent.title,
    date: prismaEvent.date,
    time: prismaEvent.time,
    description: prismaEvent.description,
    image: prismaEvent.image,
    facebookEventUrl: prismaEvent.facebookEventUrl || undefined,
    eventTagId: prismaEvent.eventTagId || undefined,
    EventTag: prismaEvent.EventTag || undefined,
    EventAttendee: prismaEvent.EventAttendee || undefined,
    isActive: prismaEvent.isActive || true
  };
}

/**
 * Get all events
 */
export async function getAllEvents(): Promise<Event[]> {
  const result = await getEvents();
  if ('success' in result && result.success && result.data) {
    return result.data.map(transformPrismaEvent);
  }
  return [];
}

/**
 * Get all past events
 */
export function getAllPastEvents(): Event[] {
  // This function is no longer used in the new implementation
  return [];
}

/**
 * Get a single event by ID
 */
export async function getEvent(id: string): Promise<Event | undefined> {
  const result = await getEventById(id);
  if ('success' in result && result.success && result.data) {
    return transformPrismaEvent(result.data);
  }
  return undefined;
}

/**
 * Add a new event
 */
export async function addEvent(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event | null> {
  const eventWithDefaults = {
    ...event,
    isActive: true
  };
  const result = await addEventAction(eventWithDefaults);
  if ('success' in result && result.success && result.data) {
    return transformPrismaEvent(result.data);
  }
  return null;
}

/**
 * Update an existing event
 */
export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
  const result = await updateEventAction(id, eventData);
  if ('success' in result && result.success && result.data) {
    return transformPrismaEvent(result.data);
  }
  return null;
}

/**
 * Delete an event
 */
export async function deleteEvent(id: string): Promise<boolean> {
  const result = await deleteEventAction(id);
  return 'success' in result && result.success;
}

/**
 * This function helps simulate what would happen if you had Facebook integration
 * In the future, you can replace this with the real Facebook integration
 */
export async function syncWithExternalSource(): Promise<Event[]> {
  return getAllEvents();
} 