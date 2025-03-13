// Facebook token script for ONE52 Bar
import dotenv from 'dotenv';
import path from 'path';
import { FacebookAdsApi, Page } from 'facebook-nodejs-business-sdk';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get credentials from environment variables
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || '';
const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '';

console.log('Facebook Token Debug Tool');
console.log('=======================');
console.log('PAGE_ID:', PAGE_ID);
console.log('ACCESS_TOKEN:', ACCESS_TOKEN.slice(0, 15) + '...' + ACCESS_TOKEN.slice(-5));

// Initialize Facebook API
try {
  FacebookAdsApi.init(ACCESS_TOKEN);
  console.log('✅ Facebook API initialized');
} catch (error) {
  console.error('❌ Error initializing Facebook API:', error.message);
  process.exit(1);
}

async function testToken() {
  try {
    console.log(`\nTesting access to Facebook Page (ID: ${PAGE_ID})...`);
    const page = new Page(PAGE_ID);
    
    // First test a simple page fields request
    console.log('1. Testing page fields request...');
    const pageInfo = await page.get(['name', 'id', 'category']);
    console.log(`✅ Successfully connected to page: "${pageInfo.name}" (${pageInfo.category})`);
    
    // Next test events access specifically
    console.log('\n2. Testing events access...');
    const events = await page.getEvents({
      fields: ['id', 'name', 'start_time'],
      limit: 3,
    });
    
    if (events && Array.isArray(events) && events.length > 0) {
      console.log(`✅ Successfully retrieved ${events.length} events:`);
      events.forEach((event, i) => {
        console.log(`   ${i+1}. "${event.name}" (${event.id}) - ${new Date(event.start_time).toLocaleString()}`);
      });
    } else {
      console.log('ℹ️ No events found, but request was successful');
    }
    
    console.log('\n✅ All tests passed! Your access token is working correctly');
    
  } catch (error) {
    console.error('\n❌ Error testing Facebook access:');
    console.error(`Error message: ${error.message}`);
    
    if (error.response) {
      console.error('\nDetailed error information:');
      console.error(`- Code: ${error.response.code}`);
      console.error(`- Message: ${error.response.message}`);
      console.error(`- Type: ${error.response.type}`);
      
      if (error.response.code === 190) {
        console.error('\n🔑 TOKEN EXPIRED OR INVALID. You need to generate a new access token:');
        console.error('1. Go to https://developers.facebook.com/tools/explorer/');
        console.error('2. Select your ONE52F app');
        console.error('3. Select "User Token" or "Page Token" as appropriate');
        console.error('4. Add permissions: pages_show_list, pages_read_engagement, events_read');
        console.error('5. Click "Generate Access Token"');
        console.error('6. Copy the new token and update your .env.local file');
      }
    }
  }
}

// Run the test
testToken(); 