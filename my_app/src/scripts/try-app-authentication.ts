// Script to try app authentication to access events
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get environment variables
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const CLIENT_TOKEN = 'ed3f685372ce425cb4cdd82d690216d4'; // From your app settings

console.log('=================================');
console.log('Facebook API - App Authentication');
console.log('=================================');

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

async function tryAppAuthentication() {
  console.log('🔑 Attempting different authentication methods to access page data...\n');
  
  // Try different authentication approaches
  let successful = false;
  
  // 1. Try app access token (app_id|app_secret)
  try {
    console.log('Method 1: Using App Access Token (app_id|app_secret)');
    const appAccessToken = `${APP_ID}|${APP_SECRET}`;
    const url = `https://graph.facebook.com/v22.0/${PAGE_ID}?fields=name,events&access_token=${appAccessToken}`;
    
    console.log('Making request to:', url.replace(appAccessToken, 'APP_ID|APP_SECRET'));
    const response = await makeRequest(url);
    
    if (response.error) {
      console.log('❌ Method 1 failed:', response.error.message);
    } else {
      console.log('✅ Method 1 succeeded!');
      console.log('Page name:', response.name);
      
      if (response.events && response.events.data) {
        console.log(`Found ${response.events.data.length} events!`);
        successful = true;
        console.log('\nEvent data sample:');
        console.log(JSON.stringify(response.events.data[0], null, 2));
      } else {
        console.log('❌ No events data returned in the response.');
        console.log('The page might not have events or they might not be accessible.');
      }
    }
  } catch (error) {
    console.log('❌ Method 1 error:', error.message);
  }
  
  // 2. Try client token
  if (!successful) {
    try {
      console.log('\nMethod 2: Using Client Token');
      const url = `https://graph.facebook.com/v22.0/${PAGE_ID}?fields=name,events&access_token=${CLIENT_TOKEN}`;
      
      console.log('Making request to:', url.replace(CLIENT_TOKEN, 'CLIENT_TOKEN'));
      const response = await makeRequest(url);
      
      if (response.error) {
        console.log('❌ Method 2 failed:', response.error.message);
      } else {
        console.log('✅ Method 2 succeeded!');
        console.log('Page name:', response.name);
        
        if (response.events && response.events.data) {
          console.log(`Found ${response.events.data.length} events!`);
          successful = true;
          console.log('\nEvent data sample:');
          console.log(JSON.stringify(response.events.data[0], null, 2));
        } else {
          console.log('❌ No events data returned in the response.');
          console.log('The page might not have events or they might not be accessible.');
        }
      }
    } catch (error) {
      console.log('❌ Method 2 error:', error.message);
    }
  }
  
  // 3. Try public access (no token)
  if (!successful) {
    try {
      console.log('\nMethod 3: Public Access (no token)');
      const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/events`;
      
      console.log('Making request to:', url);
      const response = await makeRequest(url);
      
      if (response.error) {
        console.log('❌ Method 3 failed:', response.error.message);
      } else {
        console.log('✅ Method 3 succeeded!');
        
        if (response.data && response.data.length > 0) {
          console.log(`Found ${response.data.length} events!`);
          successful = true;
          console.log('\nEvent data sample:');
          console.log(JSON.stringify(response.data[0], null, 2));
        } else {
          console.log('❌ No events found in the response.');
          console.log('The page might not have events or they might not be accessible.');
        }
      }
    } catch (error) {
      console.log('❌ Method 3 error:', error.message);
    }
  }
  
  // 4. Try searching for pages posts about events
  if (!successful) {
    try {
      console.log('\nMethod 4: Checking page posts for event mentions');
      const appAccessToken = `${APP_ID}|${APP_SECRET}`;
      const url = `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,created_time&access_token=${appAccessToken}`;
      
      console.log('Making request to:', url.replace(appAccessToken, 'APP_ID|APP_SECRET'));
      const response = await makeRequest(url);
      
      if (response.error) {
        console.log('❌ Method 4 failed:', response.error.message);
      } else {
        console.log('✅ Method 4 succeeded in getting posts!');
        
        if (response.data && response.data.length > 0) {
          console.log(`Found ${response.data.length} posts.`);
          
          // Look for posts that might be about events
          const possibleEventPosts = response.data.filter(post => 
            post.message && 
            (post.message.toLowerCase().includes('event') || 
             post.message.toLowerCase().includes('join us') ||
             post.message.toLowerCase().includes('tonight') ||
             post.message.toLowerCase().includes('tomorrow'))
          );
          
          if (possibleEventPosts.length > 0) {
            console.log(`Found ${possibleEventPosts.length} posts that might be about events.`);
            console.log('\nPossible event post sample:');
            console.log(JSON.stringify(possibleEventPosts[0], null, 2));
          } else {
            console.log('❌ No posts found that appear to be about events.');
          }
        } else {
          console.log('❌ No posts found.');
        }
      }
    } catch (error) {
      console.log('❌ Method 4 error:', error.message);
    }
  }
  
  // Summary
  if (successful) {
    console.log('\n🎉 Success! At least one method worked to access events.');
  } else {
    console.log('\n❌ All methods failed to access events directly.');
    console.log('\nPossible reasons:');
    console.log('1. The Facebook page might not have any public events created');
    console.log('2. Events might exist but are not public/accessible via API');
    console.log('3. App might still need additional permissions or review');
    console.log('\nWhat to try next:');
    console.log('1. Create a public event on your Facebook page');
    console.log('2. Get a User Access Token with manage_pages and events_management permissions');
    console.log('3. Continue using the mock data for development');
  }
}

// Run the main function
tryAppAuthentication(); 