import { Event } from '@/types';
import { FacebookAdsApi, Page } from 'facebook-nodejs-business-sdk';

// Facebook API configuration
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || '';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';

// Initialize the Facebook SDK
FacebookAdsApi.init(ACCESS_TOKEN);

// Add this interface for Facebook event data
interface FacebookEvent {
  id: string;
  name: string;
  description?: string;
  start_time: string;
  end_time?: string;
  place?: {
    name: string;
    location?: {
      city: string;
      country: string;
      latitude: number;
      longitude: number;
      state: string;
      street: string;
      zip: string;
    };
  };
  cover?: {
    source: string;
    id: string;
  };
  event_times?: Array<{
    start_time: string;
    end_time: string;
  }>;
}

/**
 * Fetches events from Facebook and converts them to the application's Event format
 */
export async function fetchFacebookEvents(): Promise<Event[]> {
  try {
    // Make sure we have the required credentials
    if (!ACCESS_TOKEN || !PAGE_ID) {
      console.error('Facebook API credentials not set');
      return [];
    }

    // Create a Page instance
    const page = new Page(PAGE_ID);
    
    // Fetch events from the Facebook page
    const response = await page.getEvents({
      fields: ['id', 'name', 'description', 'start_time', 'end_time', 'cover'],
      // You can add parameters like limit, time_filter, etc.
      // For example, to get only upcoming events:
      time_filter: 'upcoming',
      limit: 10,
    });

    if (!response || !Array.isArray(response)) {
      return [];
    }

    // Convert Facebook events to our application's Event format
    const events: Event[] = response.map((fbEvent: FacebookEvent, index: number) => {
      // Parse the start time to extract date and time
      const startTime = new Date(fbEvent.start_time);
      const endTime = fbEvent.end_time ? new Date(fbEvent.end_time) : null;
      
      // Format date as YYYY-MM-DD
      const date = startTime.toISOString().split('T')[0];
      
      // Format time range
      const timeStart = startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
      const timeEnd = endTime 
        ? endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : '';
        
      const time = timeEnd ? `${timeStart} - ${timeEnd}` : timeStart;

      return {
        id: fbEvent.id || String(index + 1),
        title: fbEvent.name || 'Untitled Event',
        date,
        time,
        description: fbEvent.description || '',
        image: fbEvent.cover?.source || undefined,
      };
    });

    return events;
  } catch (error) {
    console.error('Error fetching Facebook events:', error);
    return [];
  }
}

/**
 * Merges Facebook events with local events, prioritizing Facebook events when IDs match
 */
export async function syncEvents(localEvents: Event[]): Promise<Event[]> {
  try {
    const facebookEvents = await fetchFacebookEvents();
    
    // If Facebook fetch fails, return local events
    if (!facebookEvents.length) {
      return localEvents;
    }
    
    // Create a map of local events by ID for efficient lookup
    const localEventsMap = new Map(
      localEvents.map(event => [event.id, event])
    );
    
    // Add all Facebook events to the map (overriding duplicates)
    facebookEvents.forEach(event => {
      localEventsMap.set(event.id, event);
    });
    
    // Convert map back to array
    return Array.from(localEventsMap.values());
  } catch (error) {
    console.error('Error syncing events:', error);
    return localEvents;
  }
} 