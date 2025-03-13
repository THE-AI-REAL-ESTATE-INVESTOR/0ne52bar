// Token permission verification script
const dotenv = require('dotenv');
const path = require('path');
const https = require('https');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

if (!FACEBOOK_ACCESS_TOKEN) {
  console.error('❌ No access token found in .env.local');
  process.exit(1);
}

console.log('=================================');
console.log('Facebook Token Permission Checker');
console.log('=================================');

// Function to make a GET request to the Facebook Graph API
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

// Function to check permissions on a token
async function checkTokenPermissions() {
  try {
    // Step 1: Check if token is valid
    console.log('🔍 Checking if token is valid...');
    const tokenInfo = await makeRequest(
      `https://graph.facebook.com/v22.0/debug_token?input_token=${FACEBOOK_ACCESS_TOKEN}&access_token=${FACEBOOK_ACCESS_TOKEN}`
    );
    
    if (tokenInfo.error) {
      console.error('❌ Token is invalid:', tokenInfo.error.message);
      return false;
    }
    
    console.log('✅ Token is valid for user:', tokenInfo.data.user_id);
    console.log('✅ Application:', tokenInfo.data.application);
    
    // Step 2: Check token permissions
    console.log('\n🔍 Checking token permissions...');
    const scopes = tokenInfo.data.scopes || [];
    
    console.log('   Current permissions:');
    scopes.forEach(scope => console.log(`   - ${scope}`));
    
    // Check for required permissions
    const requiredPermissions = ['pages_show_list', 'pages_read_engagement'];
    const missingPermissions = requiredPermissions.filter(perm => !scopes.includes(perm));
    
    if (missingPermissions.length > 0) {
      console.error('\n❌ Missing required permissions:');
      missingPermissions.forEach(perm => console.error(`   - ${perm}`));
      console.log('\n⚠️ You need to get a new token with these permissions!');
      console.log('   Go to: https://developers.facebook.com/tools/explorer/');
      console.log('   1. Select your app "ONE52F" from the dropdown');
      console.log('   2. Click "Add a Permission" and add each missing permission');
      console.log('   3. Click "Generate Access Token" and approve permissions');
      console.log('   4. Copy the new token and update your .env.local file');
      return false;
    }
    
    console.log('\n✅ Token has all required permissions!');
    
    // Step 3: Check if can access pages
    console.log('\n🔍 Checking if can list pages...');
    const pagesData = await makeRequest(
      `https://graph.facebook.com/v22.0/me/accounts?access_token=${FACEBOOK_ACCESS_TOKEN}`
    );
    
    if (pagesData.error) {
      console.error('❌ Cannot access pages:', pagesData.error.message);
      return false;
    }
    
    const pages = pagesData.data || [];
    if (pages.length === 0) {
      console.log('⚠️ No pages found. Are you an admin of any Facebook Pages?');
    } else {
      console.log(`✅ Found ${pages.length} pages you can access:`);
      pages.forEach(page => console.log(`   - ${page.name} (ID: ${page.id})`));
      
      // Check if our target page is in the list
      const targetPage = pages.find(page => page.id === FACEBOOK_PAGE_ID);
      if (targetPage) {
        console.log(`\n✅ You have access to your target page: ${targetPage.name}`);
      } else {
        console.log(`\n⚠️ Your target page ID (${FACEBOOK_PAGE_ID}) was not found in the list of accessible pages.`);
      }
    }
    
    // Step 4: Try accessing target page directly
    console.log('\n🔍 Trying to access target page directly...');
    const pageData = await makeRequest(
      `https://graph.facebook.com/v22.0/${FACEBOOK_PAGE_ID}?fields=name,id&access_token=${FACEBOOK_ACCESS_TOKEN}`
    );
    
    if (pageData.error) {
      console.error('❌ Cannot access target page:', pageData.error.message);
      return false;
    }
    
    console.log(`✅ Successfully accessed target page: ${pageData.name} (ID: ${pageData.id})`);
    
    // Step 5: Check if can access events
    console.log('\n🔍 Checking if can access events...');
    const eventsData = await makeRequest(
      `https://graph.facebook.com/v22.0/${FACEBOOK_PAGE_ID}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`
    );
    
    if (eventsData.error) {
      console.error('❌ Cannot access events:', eventsData.error.message);
      return false;
    }
    
    const events = eventsData.data || [];
    if (events.length === 0) {
      console.log('⚠️ No events found on the page. Have you created any events?');
    } else {
      console.log(`✅ Found ${events.length} events on the page:`);
      events.forEach(event => {
        const date = event.start_time ? new Date(event.start_time).toLocaleDateString() : 'No date';
        console.log(`   - ${event.name} (${date})`);
      });
    }
    
    console.log('\n🎉 Congratulations! Your token is working correctly for page and event access!');
    return true;
  } catch (error) {
    console.error('Error during verification:', error.message);
    return false;
  }
}

// Run verification
checkTokenPermissions(); 