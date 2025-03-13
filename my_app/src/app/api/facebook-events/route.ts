// App Router API route handler for Facebook events
import { NextResponse } from 'next/server';
import { fetchEventsFromFacebook } from '@/lib/facebook';

/**
 * API Route handler for fetching Facebook events
 */
export async function GET() {
  try {
    // Check for required environment variables
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    
    // For debugging - Check if env vars are available (don't log the actual values in production)
    console.log('Env vars present:', {
      hasPageToken: !!pageAccessToken,
      hasPageId: !!pageId,
      hasAppSecret: !!appSecret
    });
    
    // In development, we can return mock data if credentials are missing
    if (!pageAccessToken || !pageId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock data for development (missing credentials)');
        return NextResponse.json({
          events: getMockEvents(),
          isMockData: true
        });
      } else {
        throw new Error('Missing required environment variables for Facebook API');
      }
    }
    
    // Try alternative methods to get events if we have permission issues
    try {
      // Method 1: Try using the standard page access token approach first
      const eventsData = await fetchEventsFromFacebook(
        pageAccessToken,
        pageId,
        appSecret
      );
      
      // If this worked, return the events
      if (!eventsData.error) {
        return NextResponse.json(eventsData);
      }
      
      // Method 2: If that failed, try getting public events as a fallback
      console.log('Trying alternative method for public events...');
      const publicEventsData = await fetchPublicEvents(pageId);
      
      if (!publicEventsData.error) {
        return NextResponse.json({
          events: publicEventsData.events,
          note: 'Using public events fallback method'
        });
      }
      
      // If we're here, both methods failed
      console.error('All event fetching methods failed');
      
      // In development, fall back to mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock data after all methods failed');
        return NextResponse.json({
          events: getMockEvents(),
          isMockData: true,
          error: 'All Facebook event fetching methods failed'
        });
      }
      
      throw new Error('Could not fetch events through any available method');
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    
  } catch (error) {
    console.error('Error in Facebook events API route:', error);
    
    // In development, fall back to mock data on error
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        events: getMockEvents(),
        error: error.message,
        isMockData: true
      });
    }
    
    return NextResponse.json(
      { error: error.message, events: [] },
      { status: 500 }
    );
  }
}

/**
 * Fetch public events from a page (doesn't require special permissions)
 */
async function fetchPublicEvents(pageId) {
  try {
    // This uses the public Graph API endpoint which doesn't need special permissions
    // It might return limited data compared to the full API with permissions
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/events?fields=id,name,description,start_time,end_time,cover,place,attending_count&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      events: data.data || [],
      paging: data.paging || null
    };
  } catch (error) {
    console.error('Error fetching public events:', error);
    return {
      error: error.message,
      events: []
    };
  }
}

/**
 * Generate mock events for development
 */
function getMockEvents() {
  return [
    {
      id: 'mock-event-1',
      name: 'Live Music Friday',
      description: 'Join us for an evening of live music featuring local artists. Great drinks, great atmosphere!',
      start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      end_time: new Date(Date.now() + 86400000 + 10800000).toISOString(), // Tomorrow + 3 hours
      place: {
        name: '152 Bar & Restaurant',
        location: {
          city: 'Sample City',
          country: 'United States',
          street: '152 Main St'
        }
      },
      cover: {
        source: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop'
      },
      attending_count: 24,
      interested_count: 42
    },
    {
      id: 'mock-event-2',
      name: 'Weekend DJ Night',
      description: 'Our resident DJ spinning the best tracks all night long. Come for the drinks, stay for the music!',
      start_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      end_time: new Date(Date.now() + 172800000 + 14400000).toISOString(), // Day after tomorrow + 4 hours
      place: {
        name: '152 Bar & Restaurant',
        location: {
          city: 'Sample City',
          country: 'United States',
          street: '152 Main St'
        }
      },
      cover: {
        source: 'https://images.unsplash.com/photo-1571266028271-e2bb4d420828?w=800&auto=format&fit=crop'
      },
      attending_count: 37,
      interested_count: 63
    },
    {
      id: 'mock-event-3',
      name: 'Trivia Tuesday',
      description: 'Test your knowledge with our weekly trivia night. Prizes for the winners! Teams of up to 6 people.',
      start_time: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
      end_time: new Date(Date.now() + 432000000 + 10800000).toISOString(), // 5 days from now + 3 hours
      place: {
        name: '152 Bar & Restaurant',
        location: {
          city: 'Sample City',
          country: 'United States',
          street: '152 Main St'
        }
      },
      cover: {
        source: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop'
      },
      attending_count: 15,
      interested_count: 28
    }
  ];
} 