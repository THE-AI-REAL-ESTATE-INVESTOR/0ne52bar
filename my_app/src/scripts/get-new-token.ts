// Helper script to update token and verify
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');

console.log('==================================');
console.log('Facebook Token Updater & Verifier');
console.log('==================================');
console.log('\nFollow these steps EXACTLY:');
console.log('\n1. Open https://developers.facebook.com/tools/explorer/');
console.log('2. Select app "ONE52F" from the dropdown');
console.log('3. Click "Add a Permission" and add BOTH:');
console.log('   - pages_show_list');
console.log('   - pages_read_engagement');
console.log('4. Click "Generate Access Token"');
console.log('5. Make sure all permissions are checked in the confirmation dialog');
console.log('6. Copy the new token (long string in the Access Token field)');
console.log('7. Paste the token below when prompted\n');

// Read current .env.local file
async function updateToken() {
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
    console.log('\nVerifying token permissions...');
    
    // Run the verify script
    exec('node src/scripts/verify-permissions.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running verification: ${error.message}`);
        rl.close();
        return;
      }
      
      console.log(stdout);
      
      if (stdout.includes('❌ Missing required permissions') || 
          stdout.includes('❌ Cannot access')) {
        console.log('\n⚠️ There are still permission issues with the token.');
        console.log('Please try again and make sure to add ALL required permissions.');
      } else if (stdout.includes('🎉 Congratulations')) {
        console.log('\n🎉 Perfect! Your token has all the required permissions.');
        console.log('You can now access Facebook events in your app.');
      }
      
      rl.close();
    });
  });
}

updateToken(); 