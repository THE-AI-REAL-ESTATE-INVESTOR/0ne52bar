/**
 * Event type definitions
 */

/**
 * Represents an event tag for categorization
 * @prisma.model
 */
export interface EventTag {
  /** Unique identifier */
  id: string;
  
  /** Tag name */
  name: string;
  
  /** Tag color */
  color?: string;
  
  /** Events with this tag */
  events: Event[];
}

/**
 * Represents an event attendee for registration tracking
 * @prisma.model
 */
export interface EventAttendee {
  /** Unique identifier */
  id: string;
  
  /** Attendee name */
  name: string;
  
  /** Attendee email */
  email: string;
  
  /** Number of guests */
  guestCount: number;
  
  /** Event the attendee is registered for */
  eventId: string;
  
  /** Reference to the event */
  event: Event;
  
  /** Registration date */
  registeredAt: Date;
}

/**
 * Represents an event
 * @prisma.model
 */
export interface Event {
  /** Unique identifier */
  id: string;
  
  /** Event title */
  title: string;
  
  /** Event date (YYYY-MM-DD) */
  date: string;
  
  /** Event time (HH:MM) */
  time: string;
  
  /** Event description */
  description: string;
  
  /** Event image URL */
  image: string;
  
  /** Facebook event URL */
  facebookEventUrl?: string;
  
  /** Event tags */
  tags: EventTag[];
  
  /** Registered attendees */
  attendees: EventAttendee[];
  
  /** Created at timestamp */
  createdAt: Date;
  
  /** Updated at timestamp */
  updatedAt?: Date;
  
  /** Event is active */
  isActive: boolean;
} 