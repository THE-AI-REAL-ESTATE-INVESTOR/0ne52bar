'use client';

import React from 'react';
import Image from 'next/image';

/**
 * EventsList component to display a grid of Facebook events
 * @param {Object} props - Component props
 * @param {Array} props.events - Array of Facebook event objects
 */
export function EventsList({ events = [] }) {
  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch(e) {
      return dateString || 'Date not available';
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            {event.cover && (
              <div className="relative w-full h-48">
                <Image
                  src={event.cover.source || '/images/event-placeholder.jpg'}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {event.name}
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{formatDate(event.start_time)}</span>
                </div>
                
                {event.place && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{event.place.name}</span>
                  </div>
                )}
              </div>
              
              {event.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <a 
                  href={`https://facebook.com/${event.id}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View on Facebook
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" clipRule="evenodd" />
                  </svg>
                </a>
                
                {event.attending_count > 0 && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {event.attending_count} attending
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-amber-100 rounded-lg border border-amber-300">
        <h3 className="font-semibold text-amber-800">Development Mode Notice</h3>
        <p className="text-amber-700">
          Currently displaying mock event data. In production, this component would fetch real event data from the Facebook API.
        </p>
      </div>
    </div>
  );
} 