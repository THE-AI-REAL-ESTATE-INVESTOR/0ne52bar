// Script to test a Page Access Token
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get Page ID and Token
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}===================================`);
console.log(`Testing Facebook Page Access Token`);
console.log(`===================================${colors.reset}\n`);

// Check if token exists
if (!PAGE_ACCESS_TOKEN) {
  console.log(`${colors.red}❌ ERROR: No Page Access Token found in environment variables.${colors.reset}`);
  console.log(`\n${colors.yellow}Please follow these steps to get a Page Access Token:${colors.reset}`);
  console.log(`1. Run 'npm run generate-proof' to create a secure API URL`);
  console.log(`2. Get your Page Access Token using that URL`);
  console.log(`3. Run 'npm run save-page-token' to save the token`);
  process.exit(1);
}

// Check if app secret exists
if (!APP_SECRET) {
  console.log(`${colors.yellow}⚠️ WARNING: App Secret not found in environment variables.${colors.reset}`);
  console.log(`For production use, you'll need to include appsecret_proof with API calls.`);
  console.log(`Make sure FACEBOOK_APP_SECRET is set in your .env.local file.`);
}

// Function to generate appsecret_proof
function generateAppSecretProof(accessToken, appSecret) {
  return crypto
    .createHmac('sha256', appSecret)
    .update(accessToken)
    .digest('hex');
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

async function testPageToken() {
  // Generate appsecret_proof if app secret is available
  const appSecretProof = APP_SECRET ? generateAppSecretProof(PAGE_ACCESS_TOKEN, APP_SECRET) : null;
  const proofParam = appSecretProof ? `&appsecret_proof=${appSecretProof}` : '';
  
  // First, check the token's basic info
  try {
    console.log(`${colors.blue}🔍 Testing token debug info...${colors.reset}`);
    
    // Note: debug_token endpoint doesn't require appsecret_proof
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${PAGE_ACCESS_TOKEN}&access_token=${PAGE_ACCESS_TOKEN}`;
    const debugInfo = await makeRequest(debugUrl);
    
    if (debugInfo.error) {
      console.log(`${colors.red}❌ Error checking token: ${debugInfo.error.message}${colors.reset}`);
    } else {
      if (debugInfo.data) {
        console.log(`${colors.green}✅ Token validated!${colors.reset}`);
        console.log(`${colors.yellow}Token type:${colors.reset} ${debugInfo.data.type || 'Unknown'}`);
        console.log(`${colors.yellow}Expires:${colors.reset} ${debugInfo.data.expires_at ? new Date(debugInfo.data.expires_at * 1000).toLocaleString() : 'Never'}`);
        
        if (debugInfo.data.scopes) {
          console.log(`${colors.yellow}Permissions:${colors.reset} ${debugInfo.data.scopes.join(', ')}`);
        }
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error checking token: ${error.message}${colors.reset}`);
  }
  
  // Test page info access
  try {
    console.log(`\n${colors.blue}🔍 Testing basic page info access...${colors.reset}`);
    
    const pageUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}?fields=name,category,about&access_token=${PAGE_ACCESS_TOKEN}${proofParam}`;
    const pageInfo = await makeRequest(pageUrl);
    
    if (pageInfo.error) {
      console.log(`${colors.red}❌ Error accessing page info: ${pageInfo.error.message}${colors.reset}`);
      
      if (pageInfo.error.message.includes('appsecret_proof')) {
        console.log(`${colors.yellow}This error is related to appsecret_proof. Run 'npm run generate-proof' to fix it.${colors.reset}`);
      }
    } else {
      console.log(`${colors.green}✅ Successfully accessed page info!${colors.reset}`);
      console.log(`${colors.yellow}Page name:${colors.reset} ${pageInfo.name || 'Unknown'}`);
      if (pageInfo.category) console.log(`${colors.yellow}Category:${colors.reset} ${pageInfo.category}`);
      if (pageInfo.about) console.log(`${colors.yellow}About:${colors.reset} ${pageInfo.about}`);
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error accessing page info: ${error.message}${colors.reset}`);
  }
  
  // Now test events access
  try {
    console.log(`\n${colors.blue}🔍 Testing events access...${colors.reset}`);
    
    const eventsUrl = `https://graph.facebook.com/v22.0/${PAGE_ID}/events?fields=name,start_time,description&access_token=${PAGE_ACCESS_TOKEN}${proofParam}`;
    const eventsData = await makeRequest(eventsUrl);
    
    if (eventsData.error) {
      console.log(`${colors.red}❌ Error accessing events: ${eventsData.error.message}${colors.reset}`);
      
      if (eventsData.error.message.includes('appsecret_proof')) {
        console.log(`${colors.yellow}This error is related to appsecret_proof. Run 'npm run generate-proof' to fix it.${colors.reset}`);
      } else if (eventsData.error.message.includes('permission')) {
        console.log(`${colors.yellow}This appears to be a permissions issue. Your token may not have 'pages_read_engagement' permission.${colors.reset}`);
      }
    } else {
      if (eventsData.data && eventsData.data.length > 0) {
        console.log(`${colors.green}✅ Successfully retrieved ${eventsData.data.length} events!${colors.reset}`);
        
        // Display some event info
        eventsData.data.slice(0, 3).forEach((event, i) => {
          console.log(`\n${colors.yellow}Event ${i+1}:${colors.reset} ${event.name}`);
          if (event.start_time) console.log(`${colors.yellow}Date:${colors.reset} ${new Date(event.start_time).toLocaleString()}`);
          if (event.description) {
            const shortDesc = event.description.length > 100 ? 
              `${event.description.substring(0, 100)}...` : event.description;
            console.log(`${colors.yellow}Description:${colors.reset} ${shortDesc}`);
          }
        });
        
        if (eventsData.data.length > 3) {
          console.log(`\n...and ${eventsData.data.length - 3} more events`);
        }
        
      } else {
        console.log(`${colors.yellow}⚠️ No events found. The page may not have any events.${colors.reset}`);
        console.log(`Token works properly but no events to display.`);
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error accessing events: ${error.message}${colors.reset}`);
  }
  
  // Summary
  console.log(`\n${colors.cyan}=======================`);
  console.log(`Next Steps`);
  console.log(`=======================${colors.reset}\n`);
  
  console.log(`If all tests passed, your Page Access Token is working correctly!`);
  console.log(`You can now use this token with the '/api/facebook-events' endpoint.`);
  console.log(`\nIf some tests failed, you may need to:`);
  console.log(`1. Run 'npm run generate-proof' to get a new token with proper permissions`);
  console.log(`2. Make sure your page has events created`);
  console.log(`3. Verify the PAGE_ID is correct`);
  
  if (!APP_SECRET) {
    console.log(`\n${colors.yellow}⚠️ Important:${colors.reset} For production use, make sure to add your App Secret to .env.local!`);
  }
}

// Run the test
testPageToken(); 