// Script to generate tokens using App Secret
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const CURRENT_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

// Path to .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');

console.log('=================================');
console.log('Facebook App Secret Toolkit');
console.log('=================================');

// Check requirements
if (!APP_ID) {
  console.error('❌ Missing FACEBOOK_APP_ID in .env.local');
  process.exit(1);
}

if (!APP_SECRET || APP_SECRET === 'your_app_secret_here') {
  console.error('❌ Missing FACEBOOK_APP_SECRET in .env.local');
  console.error('Please update your .env.local file with your actual app secret');
  process.exit(1);
}

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

// Function to update token in .env.local
function updateToken(newToken) {
  // Read the current file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update the token in the content
  const updatedContent = envContent.replace(
    /FACEBOOK_ACCESS_TOKEN=.*/,
    `FACEBOOK_ACCESS_TOKEN=${newToken.trim()}`
  );
  
  // Write back to file
  fs.writeFileSync(envPath, updatedContent);
  
  console.log('\n✅ Token updated successfully in .env.local');
}

// Main function
async function main() {
  try {
    // 1. Generate an App Access Token
    console.log('🔍 Generating App Access Token...');
    const appTokenUrl = `https://graph.facebook.com/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&grant_type=client_credentials`;
    
    const appTokenResponse = await makeRequest(appTokenUrl);
    
    if (appTokenResponse.error) {
      console.error('❌ Failed to generate App Access Token:', appTokenResponse.error.message);
      return;
    }
    
    const appToken = appTokenResponse.access_token;
    console.log('✅ App Access Token generated successfully!');
    
    // 2. If we have a user token, try to extend it
    if (CURRENT_TOKEN && CURRENT_TOKEN.length > 20) {
      console.log('\n🔍 Extending current User Token...');
      const extendTokenUrl = `https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${CURRENT_TOKEN}`;
      
      const extendTokenResponse = await makeRequest(extendTokenUrl);
      
      if (extendTokenResponse.error) {
        console.error('❌ Failed to extend token:', extendTokenResponse.error.message);
      } else {
        const longLivedToken = extendTokenResponse.access_token;
        console.log('✅ Token extended successfully!');
        console.log(`Token expires in: ${Math.floor(extendTokenResponse.expires_in / 86400)} days`);
        
        // Update the token in .env.local
        updateToken(longLivedToken);
        
        // 3. Try to get a page token with the long-lived token
        console.log('\n🔍 Trying to get a Page Access Token...');
        const pageTokenUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}?fields=access_token&access_token=${longLivedToken}`;
        
        const pageTokenResponse = await makeRequest(pageTokenUrl);
        
        if (pageTokenResponse.error) {
          console.error('❌ Failed to get Page Access Token:', pageTokenResponse.error.message);
        } else if (pageTokenResponse.access_token) {
          console.log('✅ Page Access Token retrieved successfully!');
          
          // Update the token in .env.local
          updateToken(pageTokenResponse.access_token);
          console.log('✅ Page Access Token saved to .env.local');
        } else {
          console.log('❌ No Page Access Token found in the response');
        }
      }
    }
    
    // 4. Try to access events with App Token
    console.log('\n🔍 Trying to access events with App Token...');
    const eventsUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}/events?access_token=${appToken}`;
    
    const eventsResponse = await makeRequest(eventsUrl);
    
    if (eventsResponse.error) {
      console.error('❌ Failed to access events with App Token:', eventsResponse.error.message);
      console.log('Note: App Tokens typically have limited access to page data.');
      console.log('You might need to get a Page Access Token from Graph API Explorer.');
    } else {
      console.log('✅ Successfully accessed events with App Token!');
      
      const events = eventsResponse.data || [];
      if (events.length === 0) {
        console.log('No events found on the page');
      } else {
        console.log(`Found ${events.length} events:`);
        events.forEach(event => {
          console.log(`- ${event.name}`);
        });
      }
      
      // Should we update to App Token?
      console.log('\n⚠️ Do you want to use the App Access Token for your app?');
      console.log('This token has limited capabilities but may work for public data');
      console.log('Type "yes" to update your .env.local with this token');
      console.log('Type anything else to keep your current token');
      
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      process.stdin.once('data', (data) => {
        const input = data.toString().trim().toLowerCase();
        
        if (input === 'yes') {
          updateToken(appToken);
          console.log('✅ App Access Token saved to .env.local');
        } else {
          console.log('Token not updated. Keeping current token.');
        }
        
        process.exit(0);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the script
main(); 