// Server-side API route to fetch Facebook events
import mockEvents from '../../data/mock-events.json';
import crypto from 'crypto';

// Function to generate appsecret_proof
function generateAppSecretProof(accessToken, appSecret) {
  return crypto
    .createHmac('sha256', appSecret)
    .update(accessToken)
    .digest('hex');
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  // Get credentials from environment variables
  const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
  const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
  
  // Check if token and secret exist
  if (!PAGE_ACCESS_TOKEN) {
    console.warn('No Page Access Token found in environment variables');
    // Return mock data in development
    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json(mockEvents);
    }
    return res.status(500).json({ error: { message: 'Server configuration error: Missing Page Access Token' } });
  }

  if (!APP_SECRET) {
    console.warn('No App Secret found in environment variables');
    // Return mock data in development
    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json(mockEvents);
    }
    return res.status(500).json({ error: { message: 'Server configuration error: Missing App Secret' } });
  }
  
  try {
    // Generate appsecret_proof
    const appSecretProof = generateAppSecretProof(PAGE_ACCESS_TOKEN, APP_SECRET);
    
    // Build Facebook API URL with appsecret_proof
    const apiUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}/events?fields=id,name,description,start_time,end_time,place,cover,attending_count,interested_count,is_online,ticket_uri&access_token=${PAGE_ACCESS_TOKEN}&appsecret_proof=${appSecretProof}`;
    
    // Fetch events from Facebook
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Check for Facebook API errors
    if (data.error) {
      console.error('Facebook API error:', data.error);
      
      // In development, fall back to mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Returning mock events data instead');
        return res.status(200).json(mockEvents);
      }
      
      return res.status(500).json({ 
        error: { 
          message: data.error.message || 'Error fetching events from Facebook',
          code: data.error.code,
          type: data.error.type
        } 
      });
    }
    
    // Check if we got valid events
    if (!data.data) {
      // No events found or unexpected format
      return res.status(200).json([]); 
    }
    
    // Format the response
    const events = data.data.map(event => ({
      id: event.id,
      name: event.name,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.place?.name,
      place: event.place,
      cover: event.cover,
      attending_count: event.attending_count,
      interested_count: event.interested_count,
      is_online: event.is_online,
      ticket_uri: event.ticket_uri
    }));
    
    // Return the events
    return res.status(200).json(events);
    
  } catch (error) {
    console.error('Server error fetching events:', error);
    
    // In development, fall back to mock data
    if (process.env.NODE_ENV === 'development') {
      return res.status(200).json(mockEvents);
    }
    
    return res.status(500).json({ 
      error: { 
        message: 'Server error fetching events' 
      } 
    });
  }
} 