import type { Event, EventTag, EventAttendee } from '@/types/events';

interface PrismaEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  description: string;
  image: string;
  facebookEventUrl: string | null;
  eventTagId: string | null;
  isActive: boolean;
  isPublic: boolean;
  showPastDate: boolean;
  createdAt: Date;
  updatedAt: Date;
  EventTag?: EventTag;
  EventAttendee?: EventAttendee[];
}

// Function to get the next occurrence of a recurring event
function getNextOccurrence(event: Event): Date | null {
  if (!event.isRecurring || !event.recurringPattern) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDate = new Date(event.date);
  const dayOfWeek = eventDate.getDay();
  let nextDate = new Date(eventDate);

  switch (event.recurringPattern) {
    case 'WEEKLY_SUNDAY':
    case 'WEEKLY_MONDAY':
    case 'WEEKLY_TUESDAY':
    case 'WEEKLY_WEDNESDAY':
    case 'WEEKLY_THURSDAY':
    case 'WEEKLY_FRIDAY':
    case 'WEEKLY_SATURDAY': {
      const targetDay = Number(event.recurringPattern.split('_')[1].toUpperCase());
      while (nextDate < today || nextDate.getDay() !== targetDay) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      break;
    }
    case 'BIWEEKLY': {
      while (nextDate < today) {
        nextDate.setDate(nextDate.getDate() + 14);
      }
      break;
    }
    case 'MONTHLY': {
      while (nextDate < today) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;
    }
    default:
      return null;
  }

  return nextDate;
}

export function transformPrismaEvent(prismaEvent: PrismaEvent): Event {
  const transformedEvent = {
    id: prismaEvent.id,
    title: prismaEvent.title,
    date: prismaEvent.date,
    time: prismaEvent.time,
    description: prismaEvent.description,
    image: prismaEvent.image,
    facebookEventUrl: prismaEvent.facebookEventUrl || undefined,
    eventTagId: prismaEvent.eventTagId || undefined,
    eventTag: prismaEvent.EventTag || undefined,
    attendees: prismaEvent.EventAttendee || undefined,
    isActive: prismaEvent.isActive,
    isPublic: prismaEvent.isPublic,
    showPastDate: prismaEvent.showPastDate,
    createdAt: prismaEvent.createdAt,
    updatedAt: prismaEvent.updatedAt
  };

  // If it's a recurring event, update the date to the next occurrence
  if (prismaEvent.isRecurring && prismaEvent.recurringPattern) {
    const nextDate = getNextOccurrence(transformedEvent);
    if (nextDate) {
      transformedEvent.date = nextDate;
    }
  }

  return transformedEvent;
}

export function isUpcomingEvent(event: Event): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // For recurring events, check if there's a future occurrence
  if (event.isRecurring && event.recurringPattern) {
    const nextDate = getNextOccurrence(event);
    return nextDate !== null;
  }

  // For non-recurring events, compare with the event date
  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);
  return eventDate >= today;
}

export function isPastEvent(event: Event): boolean {
  return !isUpcomingEvent(event);
} 