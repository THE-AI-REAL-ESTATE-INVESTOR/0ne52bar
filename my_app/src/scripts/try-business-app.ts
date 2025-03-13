// Script to try using the business app credentials to access events
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Facebook Page ID
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

// Business App credentials
const BUSINESS_APP_ID = '1419336162371074'; // ONE52F Business app
const BUSINESS_APP_SECRET = process.env.FACEBOOK_APP_SECRET || ''; // Use your existing app secret

console.log('=================================');
console.log('Facebook API - Business App Auth');
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

async function tryBusinessAppAuthentication() {
  console.log('🔍 Attempting to access events using Business app credentials...\n');
  
  // Generate app access token
  const appAccessToken = `${BUSINESS_APP_ID}|${BUSINESS_APP_SECRET}`;
  
  // Try different paths
  const endpoints = [
    {
      name: "Page Events",
      url: `https://graph.facebook.com/v22.0/${PAGE_ID}/events?access_token=${appAccessToken}`
    },
    {
      name: "Page Info with Events",
      url: `https://graph.facebook.com/v22.0/${PAGE_ID}?fields=name,events{name,description,start_time,end_time,place}&access_token=${appAccessToken}`
    },
    {
      name: "Public Page Posts",
      url: `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?access_token=${appAccessToken}`
    },
    {
      name: "Page Posts About Events",
      url: `https://graph.facebook.com/v22.0/${PAGE_ID}/posts?fields=message,created_time&access_token=${appAccessToken}`
    }
  ];
  
  let anySuccess = false;
  
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    console.log(`\n[${i+1}/${endpoints.length}] Trying ${endpoint.name}...`);
    
    try {
      // Log URL without showing actual token
      const sanitizedUrl = endpoint.url.replace(appAccessToken, 'APP_ID|APP_SECRET');
      console.log('Making request to:', sanitizedUrl);
      
      const response = await makeRequest(endpoint.url);
      
      if (response.error) {
        console.log('❌ Failed:', response.error.message);
      } else {
        console.log('✅ Success!');
        
        // Check for events or posts data
        if (response.data) {
          console.log(`Found ${response.data.length} items!`);
          if (response.data.length > 0) {
            console.log('\nSample data:');
            console.log(JSON.stringify(response.data[0], null, 2));
            anySuccess = true;
          }
        } else if (response.events && response.events.data) {
          console.log(`Found ${response.events.data.length} events!`);
          if (response.events.data.length > 0) {
            console.log('\nSample event:');
            console.log(JSON.stringify(response.events.data[0], null, 2));
            anySuccess = true;
          }
        } else {
          console.log('Response received but no events/data found:');
          console.log(JSON.stringify(response, null, 2));
        }
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  // Special approach: Try accessing using admin user ID
  try {
    console.log('\n[Special] Trying to check apps associated with page owner...');
    
    const userAppsUrl = `https://graph.facebook.com/v22.0/10170866471115282/accounts?access_token=${appAccessToken}`;
    console.log('Making request to:', userAppsUrl.replace(appAccessToken, 'APP_ID|APP_SECRET'));
    
    const response = await makeRequest(userAppsUrl);
    
    if (response.error) {
      console.log('❌ Failed:', response.error.message);
    } else {
      console.log('✅ Success!');
      console.log(JSON.stringify(response, null, 2));
      anySuccess = true;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  // Summary
  if (anySuccess) {
    console.log('\n🎉 Success! At least one endpoint worked.');
    console.log('\nYou may be able to access some data with the business app credentials.');
    console.log('You can modify this script to extract the specific data you need.');
  } else {
    console.log('\n❌ All endpoints failed.');
    console.log('\nEven with the Business app credentials, we still need proper permissions.');
    console.log('\nYour options:');
    console.log('1. Complete app review for the Business app');
    console.log('2. Create public events on your Facebook page');
    console.log('3. Continue using mock data for development');
  }
}

// Run the main function
tryBusinessAppAuthentication(); 