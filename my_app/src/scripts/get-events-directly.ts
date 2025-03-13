// Script to directly fetch public events from a Facebook page
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const CURRENT_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

console.log('==============================');
console.log('Facebook Events Direct Access');
console.log('==============================');

// Function to make a request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

// Try multiple approaches to fetch events
async function fetchEvents() {
  console.log('🔍 Attempting to fetch events using different approaches...');

  // Save successful results
  let successfulEvents = null;
  let successfulMethod = '';
  
  // Approach 1: Try with current token directly
  try {
    console.log('\n📊 APPROACH 1: Using the current token to access page events...');
    const eventsUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}/events?access_token=${CURRENT_TOKEN}`;
    const response = await makeRequest(eventsUrl);
    
    if (response.error) {
      console.log('❌ Approach 1 failed:', response.error.message);
    } else {
      console.log('✅ Approach 1 succeeded!');
      successfulEvents = response.data;
      successfulMethod = 'Current Token';
    }
  } catch (error) {
    console.log('❌ Approach 1 error:', error.message);
  }

  // Approach 2: Try with public events endpoint (no token needed)
  try {
    console.log('\n📊 APPROACH 2: Using public events endpoint...');
    const publicEventsUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}/events`;
    const response = await makeRequest(publicEventsUrl);
    
    if (response.error) {
      console.log('❌ Approach 2 failed:', response.error.message);
    } else {
      console.log('✅ Approach 2 succeeded!');
      successfulEvents = response.data;
      successfulMethod = 'Public API';
    }
  } catch (error) {
    console.log('❌ Approach 2 error:', error.message);
  }

  // Approach 3: Try accessing page posts that might contain events
  try {
    console.log('\n📊 APPROACH 3: Looking for events in page posts...');
    const postsUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?access_token=${CURRENT_TOKEN}`;
    const response = await makeRequest(postsUrl);
    
    if (response.error) {
      console.log('❌ Approach 3 failed:', response.error.message);
    } else {
      console.log('✅ Got page posts. Checking for event announcements...');
      
      // This would require further processing to extract event info from posts
      // Not a reliable method but worth checking
      console.log('   Found', response.data?.length || 0, 'posts (may or may not contain events)');
    }
  } catch (error) {
    console.log('❌ Approach 3 error:', error.message);
  }
  
  // Display results
  if (successfulEvents) {
    console.log('\n🎉 SUCCESS! Found events using', successfulMethod);
    console.log('\nEvents found:');
    
    if (successfulEvents.length === 0) {
      console.log('No events found. The page might not have any upcoming events.');
    } else {
      successfulEvents.forEach((event, index) => {
        console.log(`\n[Event ${index + 1}] ${event.name || 'Unnamed Event'}`);
        console.log(`ID: ${event.id}`);
        if (event.start_time) console.log(`Date: ${new Date(event.start_time).toLocaleString()}`);
        if (event.description) console.log(`Description: ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`);
      });
      
      // Save events to file as example data
      const eventsData = JSON.stringify(successfulEvents, null, 2);
      const sampleDataPath = path.resolve(process.cwd(), 'src/data/sample-events.json');
      
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(sampleDataPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      fs.writeFileSync(sampleDataPath, eventsData);
      console.log(`\n✅ Saved ${successfulEvents.length} events to src/data/sample-events.json`);
      console.log('You can use this file as example data for your app while developing.');
    }
  } else {
    console.log('\n❌ All approaches failed to fetch events.');
    console.log('\nSuggestions for next steps:');
    console.log('1. Create some public events on your Facebook page if none exist');
    console.log('2. Try getting a Page Access Token directly from Graph API Explorer');
    console.log('3. Consider creating mock event data for development testing');
  }
}

// Run the script
fetchEvents(); 