export interface EventTag {
  id: string;
  name: string;
  color: string;
  events?: PrismaEvent[];
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  event: PrismaEvent;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrismaEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  image: string;
  facebookEventUrl: string | null;
  eventTagId: string | null;
  isActive: boolean;
  isPublic: boolean;
  showPastDate: boolean;
  createdAt: Date;
  updatedAt: Date;
  isRecurring?: boolean;
  recurringPattern?: string;
  eventTag?: EventTag;
  EventAttendee?: EventAttendee[];
} 