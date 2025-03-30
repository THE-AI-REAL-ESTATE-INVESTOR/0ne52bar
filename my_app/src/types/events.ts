/**
 * Event type definitions
 */

/**
 * Represents an event tag for categorization
 */
export interface EventTag {
  /** Unique identifier */
  id: string;
  
  /** Tag name */
  name: string;
  
  /** Tag color */
  color: string;
  
  /** Event with this tag */
  events?: Event;
  
  /** Events through many-to-many relation */
  Event_EventToTags?: Event[];
}

/**
 * Represents an event attendee for registration tracking
 */
export interface EventAttendee {
  /** Unique identifier */
  id: string;
  
  /** Attendee name */
  name: string;
  
  /** Attendee email */
  email: string;
  
  /** Event ID */
  eventId: string;
  
  /** Number of guests */
  guestCount: number;
  
  /** Whether registered through Facebook */
  isRegisteredOnFacebook: boolean;
  
  /** Facebook registration ID */
  facebookRegistrationId?: string;
  
  /** Customer ID */
  customerId?: string;
  
  /** Member ID */
  memberId?: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  /** Reference to the event */
  event: Event;
}

/**
 * Represents an event
 */
export interface Event {
  /** Unique identifier */
  id: string;
  
  /** Event title */
  title: string;
  
  /** Event date */
  date: Date;
  
  /** Event time */
  time: string;
  
  /** Event description */
  description: string;
  
  /** Event image URL */
  image: string;
  
  /** Facebook event URL */
  facebookEventUrl?: string;
  
  /** Event tag ID */
  eventTagId?: string;
  
  /** Event tag */
  eventTag?: EventTag;
  
  /** Event tags through many-to-many relation */
  EventTag_EventToTags?: EventTag[];
  
  /** Event attendees */
  attendees?: EventAttendee[];
  
  /** Event is active */
  isActive: boolean;

  /** Event is public */
  isPublic: boolean;

  /** Show past date */
  showPastDate: boolean;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
} 