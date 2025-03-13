"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

type HelpTopic = 'general' | 'menu' | 'events' | 'settings' | 'facebook';

export default function AdminHelp() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTopic, setActiveTopic] = useState<HelpTopic>('general');

  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-lg text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-lg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-amber-500">Help & Guides</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl text-white font-medium mb-4">Help Topics</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTopic('general')}
                    className={`w-full text-left px-3 py-2 rounded text-lg ${
                      activeTopic === 'general' 
                        ? 'bg-amber-500 text-black font-medium' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Getting Started
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTopic('menu')}
                    className={`w-full text-left px-3 py-2 rounded text-lg ${
                      activeTopic === 'menu' 
                        ? 'bg-amber-500 text-black font-medium' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Managing Your Menu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTopic('events')}
                    className={`w-full text-left px-3 py-2 rounded text-lg ${
                      activeTopic === 'events' 
                        ? 'bg-amber-500 text-black font-medium' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Events & Promotions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTopic('settings')}
                    className={`w-full text-left px-3 py-2 rounded text-lg ${
                      activeTopic === 'settings' 
                        ? 'bg-amber-500 text-black font-medium' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Website Settings
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTopic('facebook')}
                    className={`w-full text-left px-3 py-2 rounded text-lg ${
                      activeTopic === 'facebook' 
                        ? 'bg-amber-500 text-black font-medium' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Facebook Integration
                  </button>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg text-white font-medium mb-2">Need More Help?</h3>
                <p className="text-base text-gray-300">
                  Download our complete PDF guide for more detailed instructions.
                </p>
                <a 
                  href="/admin/Admin.md" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block mt-3 text-base text-amber-500 hover:text-amber-400"
                >
                  View Full Documentation →
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-lg p-6">
              {activeTopic === 'general' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Getting Started with the Admin Dashboard</h2>
                  
                  <div className="prose prose-lg prose-invert max-w-none">
                    <h3>Welcome to Your Website Administration Area</h3>
                    <p>
                      This dashboard is designed to make managing your website as easy as possible.
                      No technical knowledge needed - you can update your menu, events, and business
                      information all in one place!
                    </p>
                    
                    <h3 className="mt-6">How to Login</h3>
                    <p>
                      To access the admin area, visit <code className="bg-gray-700 px-1 rounded">your-website.com/admin</code> and
                      enter your username and password. If you forget your password, contact your website administrator.
                    </p>
                    
                    <h3 className="mt-6">Dashboard Overview</h3>
                    <p>
                      After logging in, you&apos;ll see cards for different sections of your website that you can manage:
                    </p>
                    <ul className="mt-2">
                      <li><strong>Menu Management</strong> - Update food and drink items</li>
                      <li><strong>Events Management</strong> - Add or edit upcoming events</li>
                      <li><strong>Website Settings</strong> - Change contact info and business hours</li>
                    </ul>
                    
                    <h3 className="mt-6">Quick Tips for New Users</h3>
                    <ul className="mt-2">
                      <li>Click the &quot;Back to Dashboard&quot; button to return to the main screen</li>
                      <li>Your changes are saved immediately after clicking &quot;Save&quot; buttons</li>
                      <li>Use the Sign Out button when you&apos;re finished making changes</li>
                      <li>The website is responsive, so you can make changes from your computer or phone</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTopic === 'menu' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Managing Your Menu</h2>
                  
                  <div className="prose prose-lg prose-invert max-w-none">
                    <h3>How to Update Your Menu</h3>
                    <p>
                      Keeping your menu current is important for your customers. You can easily add new items,
                      update prices, or remove discontinued items using the Menu Management section.
                    </p>
                    
                    <div className="bg-gray-700 rounded-lg p-4 my-4">
                      <h4 className="font-bold text-white">Step-by-Step: Adding a Menu Item</h4>
                      <ol className="mt-2">
                        <li>Click the green &quot;Add New Item&quot; button</li>
                        <li>Fill out the name, price, and select a category</li>
                        <li>Add a description to entice customers (optional)</li>
                        <li>Click &quot;Add Item&quot; to save</li>
                      </ol>
                    </div>
                    
                    <h3 className="mt-6">Menu Organization Tips</h3>
                    <ul className="mt-2">
                      <li>Group similar items in the same category</li>
                      <li>Use clear, appetizing descriptions for food items</li>
                      <li>Keep prices up to date to avoid customer confusion</li>
                      <li>If an item is temporarily unavailable, consider removing it instead of disappointing customers</li>
                    </ul>
                    
                    <h3 className="mt-6">Frequently Asked Questions</h3>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-xl text-amber-500">How do I organize items into categories?</h4>
                      <p>
                        When adding a new item, select the appropriate category from the dropdown menu.
                        The pre-set categories include Kick Starters, Main Dishes, Salads & Wraps, Extras, and Burgers & Sandwiches.
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-xl text-amber-500">Can I create a new category?</h4>
                      <p>
                        Currently, you cannot create new categories directly. If you need a new category added,
                        please contact your website administrator.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTopic === 'events' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Events & Promotions</h2>
                  
                  <div className="prose prose-lg prose-invert max-w-none">
                    <h3>Create, Edit, and Feature Events</h3>
                    <p>
                      Keep your customers informed about upcoming events, promotions, and special nights at your bar.
                      Events are displayed on your website&apos;s Events page to attract more visitors.
                    </p>
                    
                    <div className="bg-gray-700 rounded-lg p-4 my-4">
                      <h4 className="font-bold text-white">Example Events That Drive Business</h4>
                      <ul className="mt-2">
                        <li>Live music performances</li>
                        <li>Happy hour specials</li>
                        <li>Trivia nights</li>
                        <li>Sports viewing parties</li>
                        <li>Holiday celebrations</li>
                        <li>Food & drink specials</li>
                      </ul>
                    </div>
                    
                    <h3 className="mt-6">How to Feature an Event</h3>
                    <p>
                      Important events can be highlighted on your website by checking the &quot;Feature this event&quot; box
                      when creating or editing an event. Featured events appear more prominently and may include a
                      special badge.
                    </p>
                    
                    <h3 className="mt-6">Adding Images to Events</h3>
                    <p>
                      Events with images are more engaging! You can add an image URL when creating an event.
                      For best results, use square or landscape images from your social media or other sources.
                    </p>
                    
                    <div className="mt-6 p-4 border border-amber-600 rounded-lg">
                      <h4 className="font-bold text-xl text-amber-500">Coming Soon: Facebook Events Integration</h4>
                      <p className="mt-2">
                        In the near future, you won&apos;t need to manually add events here! Any events you create
                        on your Facebook page will automatically appear on your website. This will save you time
                        and ensure your events are always in sync between platforms.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTopic === 'settings' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Website Settings</h2>
                  
                  <div className="prose prose-lg prose-invert max-w-none">
                    <h3>Managing Your Business Information</h3>
                    <p>
                      The Website Settings section allows you to update critical business information 
                      that appears throughout your website.
                    </p>
                    
                    <h3 className="mt-6">Settings You Can Customize</h3>
                    
                    <div className="mt-2">
                      <h4 className="font-semibold text-xl text-amber-500">General Information</h4>
                      <ul>
                        <li>Business Name - Your bar&apos;s official name</li>
                        <li>Address - Physical location (used on maps and for directions)</li>
                        <li>Phone Number - Primary contact number</li>
                        <li>Email - Business email for customer inquiries</li>
                        <li>About Text - Short description of your bar shown on the homepage</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-xl text-amber-500">Business Hours</h4>
                      <p>
                        Set your opening and closing times for each day of the week. These hours appear on 
                        your website and in Google search results, so keeping them accurate is important.
                      </p>
                      <p className="mt-2">
                        If you&apos;re closed on a particular day, just check the &quot;Closed&quot; box instead of 
                        entering hours.
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold text-xl text-amber-500">Social Media Links</h4>
                      <p>
                        Connect your website to your social media accounts by adding the full URLs to
                        your Facebook, Instagram, and Twitter profiles. These appear as icons in your
                        website footer.
                      </p>
                    </div>
                    
                    <h3 className="mt-6">Best Practices</h3>
                    <ul>
                      <li>Keep your information current - especially business hours and phone number</li>
                      <li>Use a professional email address (e.g., info@yourbusiness.com)</li>
                      <li>Make your &quot;About&quot; text engaging and reflective of your bar&apos;s atmosphere</li>
                      <li>Update your hours immediately if they change for holidays or special events</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTopic === 'facebook' && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Facebook Integration</h2>
                  
                  <div className="prose prose-lg prose-invert max-w-none">
                    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                      <h3 className="text-xl text-amber-500">Coming Soon!</h3>
                      <p>
                        The Facebook integration is currently under development and will be available soon.
                        When completed, this feature will automatically sync events from your Facebook page
                        to your website.
                      </p>
                    </div>
                    
                    <h3>Benefits of Facebook Integration</h3>
                    <ul>
                      <li><strong>Save time</strong> - Create events in one place only</li>
                      <li><strong>Stay consistent</strong> - Event details will match across platforms</li>
                      <li><strong>Automatic updates</strong> - Changes on Facebook reflect immediately on your website</li>
                      <li><strong>Reach more customers</strong> - Use Facebook&apos;s tools while still showcasing events on your site</li>
                    </ul>
                    
                    <h3 className="mt-6">How It Will Work</h3>
                    <p>
                      Once the integration is complete, you&apos;ll simply:
                    </p>
                    <ol>
                      <li>Create and manage events on your Facebook business page as you normally would</li>
                      <li>Your website will automatically detect and display these events</li>
                      <li>No duplicate work needed!</li>
                    </ol>
                    
                    <h3 className="mt-6">When Will This Be Available?</h3>
                    <p>
                      The Facebook integration is a priority feature and is expected to be completed soon.
                      You&apos;ll be notified when it&apos;s ready to use.
                    </p>
                    
                    <h3 className="mt-6">What To Do In The Meantime</h3>
                    <p>
                      Until the integration is complete, continue managing events through:
                    </p>
                    <ol>
                      <li>Create events on your Facebook page for social media promotion</li>
                      <li>Manually add the same events in the Events Management section of this admin dashboard</li>
                    </ol>
                    <p className="mt-4">
                      While this requires duplicate effort temporarily, it ensures your events are visible 
                      both on social media and to visitors browsing your website directly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 