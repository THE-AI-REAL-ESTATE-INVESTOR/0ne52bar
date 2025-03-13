/**
 * Event type definitions
 */
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
}

/**
 * Business information types
 */
export interface BusinessHours {
  day: string;
  hours: string;
}

export interface BusinessInfo {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  hours: BusinessHours[];
  amenities: string[];
}

/**
 * Add more type definitions as needed...
 */ 