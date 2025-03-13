// API endpoint to save a Facebook Page Access Token
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pageId, pageName, pageToken } = req.body;

    // Validate inputs
    if (!pageId || !pageToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the path to .env.local
    const envFilePath = path.resolve(process.cwd(), '.env.local');
    
    // Check if .env.local exists and read it
    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
    }

    // Prepare the new or updated environment variables
    const pageIdVar = `FACEBOOK_PAGE_ID=${pageId}`;
    const pageTokenVar = `FACEBOOK_PAGE_ACCESS_TOKEN=${pageToken}`;
    
    // Update or add the variables
    let newEnvContent;
    
    if (envContent.includes('FACEBOOK_PAGE_ID=')) {
      // Replace existing page ID
      newEnvContent = envContent.replace(
        /FACEBOOK_PAGE_ID=.*/,
        pageIdVar
      );
    } else {
      // Add new page ID
      newEnvContent = envContent + `\n${pageIdVar}`;
    }

    if (newEnvContent.includes('FACEBOOK_PAGE_ACCESS_TOKEN=')) {
      // Replace existing token
      newEnvContent = newEnvContent.replace(
        /FACEBOOK_PAGE_ACCESS_TOKEN=.*/,
        pageTokenVar
      );
    } else {
      // Add new token
      newEnvContent = newEnvContent + `\n${pageTokenVar}`;
    }

    // Write the updated content back to .env.local
    fs.writeFileSync(envFilePath, newEnvContent);

    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Page access token saved successfully',
      page: {
        id: pageId,
        name: pageName
      }
    });
  } catch (error) {
    console.error('Error saving page token:', error);
    return res.status(500).json({ error: 'Failed to save token' });
  }
} 