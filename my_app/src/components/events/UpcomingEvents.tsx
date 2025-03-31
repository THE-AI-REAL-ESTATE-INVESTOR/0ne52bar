'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types/events';

/**
 * UpcomingEvents component to display the most recent events from our data
 */
export function UpcomingEvents({ events }: { events: Event[] }) {
  // Format date to readable string
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date not available';
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch(error) {
      console.error("Date formatting error:", error);
      return dateString || 'Date not available';
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link 
            href={`/events/${event.id}`}
            key={event.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            {event.image && (
              <div className="relative w-full h-48">
                <Image
                  src={event.image}
                  alt={event.title || 'Event image'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {event.title || 'Untitled Event'}
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{formatDate(event.date)}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description.split('\n')[0]}
                </p>
              )}
              
              <div className="flex justify-end items-center">
                <span className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 