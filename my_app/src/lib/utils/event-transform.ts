import type { Event, EventTag, EventAttendee } from '@/types/events';

interface PrismaEvent {
  id: string;
  title: string;
  date: string;
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

export function transformPrismaEvent(prismaEvent: PrismaEvent): Event {
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
    isActive: prismaEvent.isActive,
    isPublic: prismaEvent.isPublic,
    showPastDate: prismaEvent.showPastDate,
    createdAt: prismaEvent.createdAt,
    updatedAt: prismaEvent.updatedAt
  };
} 