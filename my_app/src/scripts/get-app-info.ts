// Get Facebook app information
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Facebook App Information');
console.log('=======================');
console.log('Page ID:', process.env.FACEBOOK_PAGE_ID);

// Check if app ID is available
if (process.env.FACEBOOK_APP_ID) {
  console.log('App ID:', process.env.FACEBOOK_APP_ID);
  
  // Generate direct OAuth URL
  const scope = 'pages_show_list,pages_read_engagement,events_read,public_profile';
  const redirectUri = 'https://developers.facebook.com/tools/explorer/callback';
  const responseType = 'token';
  
  const oauthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=${responseType}`;
  
  console.log('\nDirect OAuth URL (copy and paste into your browser):');
  console.log(oauthUrl);
} else {
  console.log('\nApp ID not found in your .env.local file');
  console.log('You need to add FACEBOOK_APP_ID to your .env.local file or get it from Facebook Developer Dashboard');
  console.log('Visit: https://developers.facebook.com/apps/');
  
  // From the screenshot, let's use the app ID from the URL
  const appIdFromScreenshot = '1419336162371074';
  console.log('\nBased on your screenshot, your app ID might be:', appIdFromScreenshot);
  
  // Generate direct OAuth URL
  const scope = 'pages_show_list,pages_read_engagement,events_read,public_profile';
  const redirectUri = 'https://developers.facebook.com/tools/explorer/callback';
  const responseType = 'token';
  
  const oauthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appIdFromScreenshot}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=${responseType}`;
  
  console.log('\nTry this direct OAuth URL (copy and paste into your browser):');
  console.log(oauthUrl);
} 