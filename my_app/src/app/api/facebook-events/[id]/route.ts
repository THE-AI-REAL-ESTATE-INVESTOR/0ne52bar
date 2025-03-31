import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Get Facebook credentials from environment variables
  const APP_ID = process.env.FACEBOOK_APP_ID;
  const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
  
  if (!APP_ID || !APP_SECRET) {
    return NextResponse.json(
      { error: 'Facebook credentials not configured' },
      { status: 500 }
    );
  }

  try {
    // Create app access token
    const appAccessToken = `${APP_ID}|${APP_SECRET}`;
    
    // Build Facebook API URL
    const apiUrl = `https://graph.facebook.com/v18.0/${id}?fields=id,name,description,start_time,end_time,cover,place&access_token=${appAccessToken}`;
    
    // Fetch event details from Facebook
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: data.error.code || 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Facebook event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
} 