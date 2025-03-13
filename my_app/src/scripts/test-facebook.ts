// Test script to verify Facebook event fetching
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// We have to dynamically import the Facebook SDK since it has ESM imports
async function runTest() {
  try {
    // Manually initialize the Facebook SDK
    const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || '';
    const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';

    console.log('Testing Facebook event fetching...');
    console.log('FACEBOOK_ACCESS_TOKEN length:', ACCESS_TOKEN.length || 'Not set');
    console.log('FACEBOOK_PAGE_ID:', PAGE_ID || 'Not set');

    if (!ACCESS_TOKEN || !PAGE_ID) {
      console.error('Facebook API credentials not set in .env.local');
      return;
    }

    // Requiring the Facebook SDK
    const FB = require('facebook-nodejs-business-sdk');
    FB.FacebookAdsApi.init(ACCESS_TOKEN);
    
    const page = new FB.Page(PAGE_ID);
    
    console.log('Fetching events from Facebook...');
    
    // Fetch events from the Facebook page
    const response = await page.getEvents({
      fields: ['id', 'name', 'description', 'start_time', 'end_time', 'cover'],
      time_filter: 'upcoming',
      limit: 10,
    });

    console.log('Response received from Facebook API');
    
    if (!response || !Array.isArray(response)) {
      console.log('No valid response received');
      return;
    }

    // Convert Facebook events to our application's Event format
    const events = response.map((fbEvent, index) => {
      try {
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
      } catch (err) {
        console.error('Error processing event:', err);
        return null;
      }
    }).filter(Boolean);

    console.log(`Successfully fetched ${events.length} events from Facebook:`);
    
    // Print limited info about each event
    events.forEach((event, index) => {
      if (event) {
        console.log(`\nEvent ${index + 1}:`);
        console.log(`- Title: ${event.title}`);
        console.log(`- Date: ${event.date}`);
        console.log(`- Time: ${event.time}`);
        console.log(`- Description: ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`);
        console.log(`- Has image: ${!!event.image}`);
      }
    });

    if (events.length === 0) {
      console.log('\nNo events found. This could be because:');
      console.log('1. Your page doesn\'t have any upcoming events posted');
      console.log('2. The access token doesn\'t have sufficient permissions');
      console.log('3. The Page ID is incorrect');
    }
  } catch (error) {
    console.error('Error testing Facebook events:', error);
  }
}

// Call the test function
runTest(); 