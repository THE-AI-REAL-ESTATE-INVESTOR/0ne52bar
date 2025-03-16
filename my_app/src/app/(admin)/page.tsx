'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserData {
  name: string;
  email?: string;
  picture?: {
    data?: {
      url: string;
      width?: number;
      height?: number;
    }
  };
}

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  tasks: string[];
}

interface ApiResponse {
  status?: string;
  data?: any[];
  error?: {
    message?: string;
    type?: string;
    code?: number;
  };
}

interface FacebookSDK {
  init: (options: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }) => void;
  getLoginStatus: (callback: (response: { 
    status: string; 
    authResponse?: { 
      accessToken: string; 
      userID: string; 
      expiresIn: number; 
      signedRequest: string; 
    } 
  }) => void) => void;
  login: (callback: (response: { 
    status?: string; 
    authResponse?: { 
      accessToken: string; 
      userID: string; 
      expiresIn: number; 
      signedRequest: string; 
    } 
  }) => void, options: { scope: string }) => void;
  logout: (callback: () => void) => void;
  api: (path: string, methodOrParamsOrCallback?: any, paramsOrCallback?: any, callback?: (response: any) => void) => void;
}

// Extend the Window interface to include FB
declare global {
  interface Window {
    FB?: FacebookSDK;
    fbAsyncInit?: () => void;
  }
}

export default function AdminPage(): JSX.Element {
  const [loginStatus, setLoginStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pagesList, setPagesList] = useState<FacebookPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<FacebookPage | null>(null);
  const [pageToken, setPageToken] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Load Facebook SDK
  useEffect(() => {
    // Only load once
    if (window.FB) return;

    // This function will be called after the FB SDK is loaded
    window.fbAsyncInit = function() {
      if (!window.FB) return;
      
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1419336162371074', // Using your Business app ID
        cookie: true,
        xfbml: true,
        version: 'v22.0'
      });
      
      checkLoginStatus();
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  // Check login status
  const checkLoginStatus = (): void => {
    if (!window.FB) return;

    window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected' && response.authResponse) {
        setLoginStatus('connected');
        fetchUserData(response.authResponse.accessToken);
      } else {
        setLoginStatus('disconnected');
      }
    });
  };

  // Handle login
  const handleLogin = (): void => {
    if (!window.FB) return;

    window.FB.login(function(response) {
      if (response.authResponse) {
        setLoginStatus('connected');
        fetchUserData(response.authResponse.accessToken);
      } else {
        setLoginStatus('disconnected');
      }
    }, { 
      // Using permissions that should be available for all apps
      // instead of pages_read_engagement and pages_show_list
      scope: 'public_profile,email,pages_manage_metadata'
    });
  };

  // Handle logout
  const handleLogout = (): void => {
    if (!window.FB) return;

    window.FB.logout(function() {
      setLoginStatus('disconnected');
      setUserData(null);
      setPagesList([]);
      setSelectedPage(null);
      setPageToken('');
    });
  };

  // Fetch user data
  const fetchUserData = (accessToken: string): void => {
    if (!window.FB) return;

    window.FB.api('/me', { fields: 'name,email,picture' }, function(response: UserData) {
      setUserData(response);
    });

    // Fetch pages the user manages
    window.FB.api('/me/accounts', function(response: { data?: FacebookPage[] }) {
      if (response && response.data) {
        setPagesList(response.data);
      }
    });
  };

  // Select a page
  const handlePageSelect = (page: FacebookPage): void => {
    setSelectedPage(page);
    setPageToken(page.access_token);
  };

  // Test accessing page events with the token
  const testPageAccess = (): void => {
    if (!selectedPage || !pageToken) return;

    setApiResponse({ status: 'loading' });

    window.FB?.api(
      `/${selectedPage.id}/events`,
      'GET',
      { access_token: pageToken },
      function(response) {
        setApiResponse(response);
      }
    );
  };

  // Save the page token to the server
  const savePageToken = async (): Promise<void> => {
    if (!selectedPage || !pageToken) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/save-page-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: selectedPage.id,
          pageName: selectedPage.name,
          pageToken: pageToken
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSaveMessage('✅ Token saved successfully!');
      } else {
        setSaveMessage(`❌ Error: ${data.error || 'Failed to save token'}`);
      }
    } catch (error) {
      setSaveMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link href="/" className="text-blue-100 hover:text-white">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Facebook Login Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Facebook Integration</h2>
          
          {loginStatus === 'loading' && (
            <p className="text-gray-600">Loading Facebook SDK...</p>
          )}

          {loginStatus === 'disconnected' && (
            <div>
              <p className="mb-4 text-gray-700">Log in with Facebook to access your page and events.</p>
              <button 
                onClick={handleLogin}
                className="bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#166FE5] transition"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                  </svg>
                  Login with Facebook
                </span>
              </button>
            </div>
          )}

          {loginStatus === 'connected' && userData && (
            <div>
              <div className="flex items-center mb-6">
                {userData.picture && (
                  <img 
                    src={userData.picture.data?.url} 
                    alt={userData.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <p className="font-medium">{userData.name}</p>
                  {userData.email && <p className="text-gray-600 text-sm">{userData.email}</p>}
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-auto bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
                >
                  Logout
                </button>
              </div>

              {/* Pages List */}
              {pagesList.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Your Facebook Pages</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                    {pagesList.map(page => (
                      <div 
                        key={page.id}
                        className={`p-3 mb-2 rounded cursor-pointer flex items-center ${selectedPage?.id === page.id ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handlePageSelect(page)}
                      >
                        <div>
                          <p className="font-medium">{page.name}</p>
                          <p className="text-xs text-gray-500">ID: {page.id}</p>
                        </div>
                        {selectedPage?.id === page.id && (
                          <span className="ml-auto bg-blue-500 text-white text-xs py-1 px-2 rounded">Selected</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                  No Facebook Pages found. You need to be an admin of at least one Facebook Page.
                </div>
              )}

              {/* Selected Page Token */}
              {selectedPage && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Page Access Token</h3>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="mb-2"><strong>Page:</strong> {selectedPage.name}</p>
                    <p className="mb-4"><strong>ID:</strong> {selectedPage.id}</p>
                    
                    <div className="relative">
                      <textarea 
                        readOnly
                        value={pageToken}
                        className="w-full h-20 p-2 border border-gray-300 rounded text-sm font-mono bg-gray-50"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pageToken);
                          alert('Token copied to clipboard!');
                        }}
                        className="absolute top-2 right-2 bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        Copy
                      </button>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={testPageAccess}
                        className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                      >
                        Test Access
                      </button>
                      
                      <button
                        onClick={savePageToken}
                        disabled={isSaving}
                        className={`px-3 py-2 rounded text-sm text-white ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 transition'}`}
                      >
                        {isSaving ? 'Saving...' : 'Save Token to Server'}
                      </button>
                    </div>
                    
                    {saveMessage && (
                      <p className={`mt-2 text-sm ${saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                        {saveMessage}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* API Response */}
              {apiResponse && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">API Response</h3>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200 overflow-auto max-h-80">
                    {apiResponse.status === 'loading' ? (
                      <p>Loading...</p>
                    ) : apiResponse.error ? (
                      <div className="text-red-600">
                        <p className="font-medium mb-1">Error:</p>
                        <p>{apiResponse.error.message}</p>
                        {apiResponse.error.code && <p className="text-sm">Code: {apiResponse.error.code}</p>}
                      </div>
                    ) : (
                      <pre className="text-xs overflow-auto">{JSON.stringify(apiResponse, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Log in with your Facebook account that has admin access to your business page</li>
            <li>Select your Facebook page from the list</li>
            <li>Click "Test Access" to verify the token works correctly</li>
            <li>Click "Save Token to Server" to store the token securely for your app to use</li>
            <li>Once saved, your app will use this token to fetch events from your Facebook page</li>
          </ol>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">About Page Access Tokens</h3>
            <p className="text-blue-700 text-sm">
              Page Access Tokens allow your app to manage and access data from your Facebook Page. 
              These tokens don't expire unless you change your Facebook password or revoke them manually.
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">Environment Variables</h3>
            <p className="text-green-700 text-sm">
              Your .env.local file is being used to store the Facebook credentials. The Page Access Token you save here will be written to that file.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 