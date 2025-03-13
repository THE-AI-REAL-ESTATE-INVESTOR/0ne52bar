// App Router API route handler to save a Facebook Page Access Token
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * API Route handler for saving Facebook Page Access Token
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { pageId, pageName, pageToken } = body;
    
    // Validate required fields
    if (!pageId || !pageToken) {
      return NextResponse.json(
        { error: 'Missing required fields: pageId and pageToken are required' },
        { status: 400 }
      );
    }
    
    // Env file path (.env.local in project root)
    const envFilePath = path.resolve(process.cwd(), '.env.local');
    
    // Read the current .env.local file content
    let envFileContent = '';
    try {
      envFileContent = fs.readFileSync(envFilePath, 'utf8');
    } catch (err) {
      console.warn('Could not read .env.local file, will create a new one:', err.message);
      // Not returning an error, we'll create the file if it doesn't exist
    }
    
    // Check if the environment variables already exist
    const pageIdRegex = /^FACEBOOK_PAGE_ID=.*/m;
    const tokenRegex = /^FACEBOOK_PAGE_ACCESS_TOKEN=.*/m;
    
    // Update or add the environment variables
    let updatedContent = envFileContent;
    
    // Update or add PAGE_ID
    if (pageIdRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(pageIdRegex, `FACEBOOK_PAGE_ID=${pageId}`);
    } else {
      updatedContent += `\nFACEBOOK_PAGE_ID=${pageId}`;
    }
    
    // Update or add PAGE_ACCESS_TOKEN
    if (tokenRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(tokenRegex, `FACEBOOK_PAGE_ACCESS_TOKEN=${pageToken}`);
    } else {
      updatedContent += `\nFACEBOOK_PAGE_ACCESS_TOKEN=${pageToken}`;
    }
    
    // Save the updated content back to the .env.local file
    fs.writeFileSync(envFilePath, updatedContent.trim());
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Page token saved successfully',
      savedDetails: {
        pageId,
        pageName,
        // Don't echo the token back for security
        tokenSaved: true
      }
    });
    
  } catch (error) {
    console.error('Error saving page token:', error);
    return NextResponse.json(
      { error: `Failed to save page token: ${error.message}` },
      { status: 500 }
    );
  }
} 