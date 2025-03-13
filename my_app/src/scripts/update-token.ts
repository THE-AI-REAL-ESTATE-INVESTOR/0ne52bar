// Utility to update Facebook token in .env.local
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');

// Read current .env.local file
async function updateToken() {
  console.log('Facebook Token Update Utility');
  console.log('============================');
  
  if (!fs.existsSync(envPath)) {
    console.error(`Error: .env.local file not found at ${envPath}`);
    process.exit(1);
  }
  
  // Read the current file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Ask for the new token
  rl.question('\nPaste your new Facebook access token from Graph API Explorer:\n> ', (newToken) => {
    if (!newToken || newToken.trim().length < 20) {
      console.error('Error: Token appears to be invalid (too short)');
      rl.close();
      return;
    }
    
    // Update the token in the content
    const updatedContent = envContent.replace(
      /FACEBOOK_ACCESS_TOKEN=.*/,
      `FACEBOOK_ACCESS_TOKEN=${newToken.trim()}`
    );
    
    // Write back to file
    fs.writeFileSync(envPath, updatedContent);
    
    console.log('\n✅ Token updated successfully in .env.local');
    console.log('Run "pnpm facebook-token" to test the new token');
    
    rl.close();
  });
}

updateToken(); 