// Script to save a Page Access Token to .env.local
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
console.log(`Save Facebook Page Access Token`);
console.log(`===================================${colors.reset}\n`);

console.log(`This script will save your Facebook Page Access Token to .env.local file.`);
console.log(`${colors.yellow}⚠️  Warning: This token grants access to your Facebook Page.${colors.reset}`);
console.log(`Keep it secret and never commit it to a public repository.\n`);

// Check if .env.local exists
const envPath = path.resolve(process.cwd(), '.env.local');
let existingEnvContent = '';

if (fs.existsSync(envPath)) {
  existingEnvContent = fs.readFileSync(envPath, 'utf8');
}

// Ask for the token
rl.question(`${colors.blue}Enter your Page Access Token:${colors.reset} `, (token) => {
  if (!token || token.trim() === '') {
    console.log(`${colors.red}❌ No token provided. Aborting.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Check if token looks valid (very basic check)
  if (token.length < 50) {
    console.log(`${colors.yellow}⚠️ Warning: Token seems too short. Facebook tokens are usually longer.${colors.reset}`);
    console.log(`Are you sure this is the correct token?`);
  }
  
  rl.question(`${colors.blue}Enter your Facebook Page ID (press Enter to use existing):${colors.reset} `, (pageId) => {
    // Process the .env file
    let newEnvContent = existingEnvContent;
    
    // Update or add the token
    if (newEnvContent.includes('FACEBOOK_PAGE_ACCESS_TOKEN=')) {
      // Replace existing token
      newEnvContent = newEnvContent.replace(
        /FACEBOOK_PAGE_ACCESS_TOKEN=.*/,
        `FACEBOOK_PAGE_ACCESS_TOKEN=${token}`
      );
    } else {
      // Add new token
      newEnvContent += `\nFACEBOOK_PAGE_ACCESS_TOKEN=${token}\n`;
    }
    
    // Update page ID if provided
    if (pageId && pageId.trim() !== '') {
      if (newEnvContent.includes('FACEBOOK_PAGE_ID=')) {
        // Replace existing page ID
        newEnvContent = newEnvContent.replace(
          /FACEBOOK_PAGE_ID=.*/,
          `FACEBOOK_PAGE_ID=${pageId}`
        );
      } else {
        // Add new page ID
        newEnvContent += `\nFACEBOOK_PAGE_ID=${pageId}\n`;
      }
    }
    
    // Write the updated content
    try {
      fs.writeFileSync(envPath, newEnvContent);
      console.log(`\n${colors.green}✅ Successfully saved token to .env.local${colors.reset}`);
      console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
      console.log(`1. Run 'npm run test-page-token' to test the token`);
      console.log(`2. Start your app with 'npm run dev'`);
      console.log(`3. Visit the events page to see real events from Facebook`);
    } catch (error) {
      console.log(`\n${colors.red}❌ Error saving token: ${error.message}${colors.reset}`);
    }
    
    rl.close();
  });
});

rl.on('close', () => {
  console.log(`\n${colors.cyan}Script completed${colors.reset}`);
}); 