import { Event } from '@/types';
import { events as localEvents } from '@/data/events';

// In-memory storage for events (in a real app, this would be a database)
let events: Event[] = [...localEvents];

/**
 * Get all events
 */
export function getAllEvents(): Event[] {
  return [...events].sort((a, b) => {
    // Sort by date (most recent first)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

/**
 * Get a single event by ID
 */
export function getEvent(id: string): Event | undefined {
  return events.find(event => event.id === id);
}

/**
 * Add a new event
 */
export function addEvent(event: Omit<Event, 'id'>): Event {
  const newEvent: Event = {
    ...event,
    id: Date.now().toString(), // Simple ID generation
  };
  
  events.push(newEvent);
  return newEvent;
}

/**
 * Update an existing event
 */
export function updateEvent(id: string, eventData: Partial<Event>): Event | null {
  const index = events.findIndex(event => event.id === id);
  if (index === -1) return null;
  
  const updatedEvent = {
    ...events[index],
    ...eventData,
  };
  
  events[index] = updatedEvent;
  return updatedEvent;
}

/**
 * Delete an event
 */
export function deleteEvent(id: string): boolean {
  const initialLength = events.length;
  events = events.filter(event => event.id !== id);
  return events.length < initialLength;
}

/**
 * This function helps simulate what would happen if you had Facebook integration
 * In the future, you can replace this with the real Facebook integration
 */
export async function syncWithExternalSource(): Promise<Event[]> {
  // In a real implementation, this would fetch from Facebook
  // For now, we're just returning the events we already have
  return getAllEvents();
} 