"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessSettings {
  businessName: string;
  address: string;
  phoneNumber: string;
  email: string;
  aboutText: string;
  hours: BusinessHours[];
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export default function WebsiteSettings() {
  const { status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'social'>('general');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<null | 'saving' | 'saved' | 'error'>(null);
  
  // Initial demo data
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: 'ONE 52 Bar & Kitchen',
    address: '152 Main Street, Houston, TX 77001',
    phoneNumber: '(713) 555-1234',
    email: 'contact@one52bar.com',
    aboutText: 'ONE 52 Bar & Kitchen offers a unique dining experience with great food, drinks, and atmosphere. Join us for daily specials, live music, and more!',
    hours: [
      { day: 'Monday', open: '11:00', close: '22:00', closed: false },
      { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
      { day: 'Wednesday', open: '11:00', close: '23:00', closed: false },
      { day: 'Thursday', open: '11:00', close: '23:00', closed: false },
      { day: 'Friday', open: '11:00', close: '00:00', closed: false },
      { day: 'Saturday', open: '11:00', close: '00:00', closed: false },
      { day: 'Sunday', open: '12:00', close: '21:00', closed: false },
    ],
    socialMedia: {
      facebook: 'https://facebook.com/one52bar',
      instagram: 'https://instagram.com/one52bar',
      twitter: 'https://twitter.com/one52bar',
    }
  });
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
    
    if (status === 'authenticated') {
      // In a real app, you would fetch the current settings from an API
      setLoading(false);
    }
  }, [status, router]);
  
  // Handle form input changes for general info
  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle social media changes
  const handleSocialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };
  
  // Handle hours change
  const handleHoursChange = (
    index: number, 
    field: 'open' | 'close' | 'closed', 
    value: string | boolean
  ) => {
    setSettings(prev => {
      const updatedHours = [...prev.hours];
      if (field === 'closed') {
        updatedHours[index] = {
          ...updatedHours[index],
          closed: value as boolean
        };
      } else {
        updatedHours[index] = {
          ...updatedHours[index],
          [field]: value
        };
      }
      return {
        ...prev,
        hours: updatedHours
      };
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Simulate API call to save settings
    setTimeout(() => {
      // In a real app, you would save data to an API here
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }, 1000);
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-amber-500">Website Settings</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md">
              Back to Dashboard
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'general' 
                ? 'text-amber-500 border-b-2 border-amber-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General Information
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'hours' 
                ? 'text-amber-500 border-b-2 border-amber-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('hours')}
          >
            Business Hours
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'social' 
                ? 'text-amber-500 border-b-2 border-amber-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('social')}
          >
            Social Media
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* General Information */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-gray-300 mb-2">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleGeneralChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={settings.email}
                    onChange={handleGeneralChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="aboutText" className="block text-gray-300 mb-2">About Text</label>
                <textarea
                  id="aboutText"
                  name="aboutText"
                  value={settings.aboutText}
                  onChange={handleGeneralChange}
                  rows={5}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
          
          {/* Business Hours */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <p className="text-gray-300">Set your regular business hours. Check &apos;Closed&apos; if you&apos;re not open on a particular day.</p>
              <div className="bg-gray-800 rounded-lg p-4">
                {settings.hours.map((hour, index) => (
                  <div key={hour.day} className="grid grid-cols-12 gap-4 mb-3 items-center">
                    <div className="col-span-3">
                      <span className="text-gray-300">{hour.day}</span>
                    </div>
                    
                    <div className="col-span-3">
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(e) => handleHoursChange(index, 'open', e.target.value)}
                        disabled={hour.closed}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(e) => handleHoursChange(index, 'close', e.target.value)}
                        disabled={hour.closed}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`closed-${index}`}
                          checked={hour.closed}
                          onChange={(e) => handleHoursChange(index, 'closed', e.target.checked)}
                          className="w-4 h-4 text-amber-500 border-gray-600 rounded focus:ring-amber-500"
                        />
                        <label htmlFor={`closed-${index}`} className="ml-2 text-gray-300">Closed</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Social Media */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <p className="text-gray-300 mb-4">Link your social media accounts to display on your website.</p>
              <div>
                <label htmlFor="facebook" className="block text-gray-300 mb-2">Facebook</label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={handleSocialChange}
                  placeholder="https://facebook.com/your-page"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="instagram" className="block text-gray-300 mb-2">Instagram</label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={handleSocialChange}
                  placeholder="https://instagram.com/your-account"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-gray-300 mb-2">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={handleSocialChange}
                  placeholder="https://twitter.com/your-account"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
          
          {/* Save button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md font-medium ${
                saveStatus === 'saving'
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-black'
              }`}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' 
                ? 'Saving...' 
                : saveStatus === 'saved'
                  ? 'Saved!'
                  : 'Save Changes'}
            </button>
          </div>
          
          {saveStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-900 bg-opacity-50 text-red-300 rounded-md">
              There was an error saving your changes. Please try again.
            </div>
          )}
        </form>
        
        <div className="mt-6 text-gray-400 text-sm">
          <p>* In this demo, changes are not persisted to a database. Refreshing the page will reset all changes.</p>
        </div>
      </div>
    </div>
  );
} 