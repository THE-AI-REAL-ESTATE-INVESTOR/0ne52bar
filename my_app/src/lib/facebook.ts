/**
 * Facebook API utility functions
 */
import crypto from 'crypto';

// Define types for Facebook events response
export interface FacebookEvent {
  id: string;
  name: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  place?: {
    name?: string;
    location?: {
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      street?: string;
      zip?: string;
    };
  };
  cover?: {
    source?: string;
    offset_x?: number;
    offset_y?: number;
  };
  attending_count?: number;
  maybe_count?: number;
  interested_count?: number;
  is_canceled?: boolean;
  ticket_uri?: string;
}

export interface FacebookEventsResponse {
  error?: string;
  events?: FacebookEvent[];
}

/**
 * Generate appsecret_proof for improved API security
 * @param {string} accessToken - Facebook access token
 * @param {string} appSecret - Facebook app secret
 * @returns {string | null} - HMAC-SHA256 hash of the access token using the app secret
 */
export function generateAppSecretProof(accessToken: string, appSecret: string): string | null {
  if (!accessToken || !appSecret) return null;
  return crypto
    .createHmac('sha256', appSecret)
    .update(accessToken)
    .digest('hex');
}

/**
 * Fetches Facebook events using the server's environment variables
 * @returns {Promise<FacebookEventsResponse>} - Events data or error object
 */
export async function getFacebookEvents(): Promise<FacebookEventsResponse> {
  try {
    // Use a fetch request to our own API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/facebook-events`, {
      // Add cache settings for Next.js to use ISR
      next: { 
        revalidate: 3600 // Revalidate once per hour
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as FacebookEventsResponse;
  } catch (error) {
    console.error('Error fetching Facebook events:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to fetch events from Facebook',
      events: []
    };
  }
}

/**
 * Fetches Facebook events directly from Facebook Graph API
 * Not typically used on the client side, as it would expose credentials
 * @param {string} accessToken - Facebook access token
 * @param {string} pageId - Facebook page ID
 * @param {string} appSecret - Facebook app secret (optional, for appsecret_proof)
 * @returns {Promise<Object>} - Events data or error object
 */
export async function fetchEventsFromFacebook(accessToken, pageId, appSecret = null) {
  if (!accessToken || !pageId) {
    return {
      error: 'Missing required credentials (accessToken or pageId)',
      events: []
    };
  }

  try {
    // Generate appsecret_proof if app secret is provided
    const appSecretProof = appSecret ? generateAppSecretProof(accessToken, appSecret) : null;
    
    // Build the URL with proper parameters
    let apiUrl = `https://graph.facebook.com/v18.0/${pageId}/events?access_token=${accessToken}`;
    
    // Add fields we want to retrieve
    apiUrl += '&fields=id,name,description,start_time,end_time,cover,place,attending_count,interested_count,ticket_uri';
    
    // Add appsecret_proof if available
    if (appSecretProof) {
      apiUrl += `&appsecret_proof=${appSecretProof}`;
    }
    
    const response = await fetch(apiUrl);
    
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
    console.error('Error fetching events from Facebook:', error);
    return {
      error: error.message || 'Unknown error occurred',
      events: []
    };
  }
} 