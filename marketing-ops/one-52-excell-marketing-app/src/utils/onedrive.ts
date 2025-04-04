import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import { readFile } from 'fs/promises';

interface OneDriveConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  folderName: string;
}

interface TokenResponse {
  access_token: string;
  error_description?: string;
}

export async function uploadToOneDrive(filePath: string, config: OneDriveConfig): Promise<string> {
  try {
    // Initialize the Microsoft Graph client
    const client = Client.init({
      authProvider: async (done) => {
        try {
          // Get access token using client credentials
          const token = await getAccessToken(config);
          done(null, token);
        } catch (error) {
          done(error, null);
        }
      }
    });

    // Create folder if it doesn't exist
    const folder = await ensureFolderExists(client, config.folderName);

    // Upload file
    const fileName = filePath.split('/').pop() || 'marketing-campaign.xlsx';
    const fileBuffer = await readFile(filePath);
    const file = await client
      .api(`/me/drive/items/${folder.id}:/${fileName}:/content`)
      .put(fileBuffer);

    console.log(`✅ File uploaded to OneDrive: ${file.webUrl}`);
    return file.webUrl;
  } catch (error) {
    console.error('❌ Error uploading to OneDrive:', error);
    throw error;
  }
}

async function getAccessToken(config: OneDriveConfig): Promise<string> {
  const response = await fetch(
    `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    }
  );

  const data = await response.json() as TokenResponse;
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description}`);
  }

  return data.access_token;
}

async function ensureFolderExists(client: Client, folderName: string) {
  try {
    // Check if folder exists
    const response = await client
      .api('/me/drive/root/children')
      .filter(`name eq '${folderName}'`)
      .get();

    if (response.value.length > 0) {
      return response.value[0];
    }

    // Create folder if it doesn't exist
    return await client
      .api('/me/drive/root/children')
      .post({
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'replace',
      });
  } catch (error) {
    console.error('Error ensuring folder exists:', error);
    throw error;
  }
} 