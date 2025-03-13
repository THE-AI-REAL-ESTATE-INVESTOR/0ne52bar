// Script to generate appsecret_proof for Facebook API calls
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`${colors.cyan}===============================`);
console.log(`Facebook API Secure Access Helper`);
console.log(`===============================${colors.reset}\n`);

console.log(`This script will help you generate secure Facebook API calls with appsecret_proof.\n`);

// Function to generate appsecret_proof
function generateAppSecretProof(accessToken, appSecret) {
  return crypto
    .createHmac('sha256', appSecret)
    .update(accessToken)
    .digest('hex');
}

// Get existing credentials
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

if (!APP_SECRET) {
  console.log(`${colors.red}❌ App Secret not found in .env.local file${colors.reset}`);
  console.log(`You need your App Secret to generate a secure proof.`);
  process.exit(1);
}

// Ask for access token
rl.question(`${colors.blue}Enter your User Access Token (from Graph API Explorer):${colors.reset} `, (accessToken) => {
  if (!accessToken || accessToken.trim() === '') {
    console.log(`${colors.red}❌ No token provided. Aborting.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Generate the proof
  const appSecretProof = generateAppSecretProof(accessToken, APP_SECRET);
  
  console.log(`\n${colors.green}✅ Generated appsecret_proof:${colors.reset}`);
  console.log(appSecretProof);
  
  // Now create the URL to get page accounts
  const apiUrlWithProof = `https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
  
  console.log(`\n${colors.yellow}Use this URL to get your Page Access Token:${colors.reset}`);
  console.log(apiUrlWithProof);
  
  console.log(`\n${colors.cyan}Instructions:${colors.reset}`);
  console.log(`1. Open a browser and paste the URL above`);
  console.log(`2. Find your page in the results and copy its "access_token" value`);
  console.log(`3. Use 'npm run save-page-token' to save this token`);
  
  // Option to get page events directly
  if (PAGE_ID) {
    rl.question(`\n${colors.blue}Do you want to generate a URL to access page events directly? (y/n):${colors.reset} `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        const eventsApiUrlWithProof = `https://graph.facebook.com/v22.0/${PAGE_ID}/events?fields=id,name,description,start_time,end_time,place,cover,attending_count&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
        
        console.log(`\n${colors.yellow}Use this URL to get page events directly:${colors.reset}`);
        console.log(eventsApiUrlWithProof);
      }
      
      rl.close();
    });
  } else {
    rl.close();
  }
});

rl.on('close', () => {
  console.log(`\n${colors.cyan}Script completed${colors.reset}`);
}); 