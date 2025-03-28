'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Event } from '@/types/events';
import { events } from '@/data/events';
import { pastEvents } from '@/data/past-events';

interface EventsClientPageProps {
  initialEvents: Event[];
}

export default function EventsClientPage({ initialEvents }: EventsClientPageProps) {
  const searchParams = useSearchParams();
  const [appDate, setAppDate] = useState<Date>(new Date());
  const [combinedEvents, setCombinedEvents] = useState<Event[]>([]);
  
  useEffect(() => {    
    // Combine all events and add required properties
    const allEvents = [...events, ...pastEvents, ...initialEvents].map(event => ({
      ...event,
      tags: [],
      attendees: [],
      createdAt: new Date(event.date),
      isActive: true
    }));
    
    setCombinedEvents(allEvents);

    // Check if there's a date parameter for demo/testing purposes
    const dateParam = searchParams.get('demoDate');
    
    if (dateParam) {
      const parsedDate = new Date(dateParam);
      if (!isNaN(parsedDate.getTime())) {
        setAppDate(parsedDate);
      }
    }
  }, [searchParams, initialEvents]);

  // Reset time component to compare dates only
  const today = new Date(appDate);
  today.setHours(0, 0, 0, 0);
  
  // Split events into upcoming (including today) and past
  const upcomingEvents = combinedEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastEventsArray = combinedEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      {/* Date Override Demo Controls (only visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-800 p-4 mb-8 rounded-lg">
          <h3 className="text-xl text-amber-400 mb-2">Demo Date Controls</h3>
          <p className="text-gray-300 mb-2">Current app date: {today.toDateString()}</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/events" className="px-3 py-1 bg-blue-600 rounded text-white text-sm">Current Date</Link>
            <Link href="/events?demoDate=2025-03-14" className="px-3 py-1 bg-amber-500 rounded text-white text-sm">Mar 14, 2025</Link>
            <Link href="/events?demoDate=2024-10-30" className="px-3 py-1 bg-purple-600 rounded text-white text-sm">Oct 30, 2024</Link>
            <Link href="/events?demoDate=2025-04-01" className="px-3 py-1 bg-green-600 rounded text-white text-sm">Apr 1, 2025</Link>
          </div>
        </div>
      )}
      
      {/* Upcoming Events Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex flex-col bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
              <Link 
                href={`/events/${event.id}`}
                className="flex-1 block"
              >
                {event.image && (
                  <div className="h-48 bg-gray-800 relative">
                    <div className="h-full w-full flex items-center justify-center">
                      <Image 
                        src={event.image}
                        alt={event.title}
                        fill
                        style={{objectFit: 'cover'}}
                      />
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <div className="text-gray-400 text-sm mb-2">
                    <span>{new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span> • <span>{event.time}</span>
                  </div>
                  <p className="text-gray-300 line-clamp-2">{event.description}</p>
                  <div className="mt-4 text-amber-500 font-medium">View Details →</div>
                </div>
              </Link>
              
              {event.facebookEventUrl && (
                <div className="px-4 pb-4 mt-auto">
                  <a 
                    href={event.facebookEventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-medium inline-block"
                  >
                    Facebook Event →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {upcomingEvents.length === 0 && (
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <h2 className="text-xl">No upcoming events scheduled at this time.</h2>
            <p className="mt-2 text-gray-400">Check back soon for new events!</p>
          </div>
        )}
      </section>
      
      {/* Past Events Section */}
      {pastEventsArray.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-700">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-400">Past Events</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEventsArray.map((event) => (
              <div key={event.id} className="flex flex-col bg-gray-800/50 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Link 
                  href={`/events/${event.id}`}
                  className="flex-1 block"
                >
                  {event.image && (
                    <div className="h-48 bg-gray-800 relative">
                      <div className="h-full w-full flex items-center justify-center">
                        <Image 
                          src={event.image}
                          alt={event.title}
                          fill
                          style={{objectFit: 'cover'}}
                          className="grayscale hover:grayscale-0 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2 text-gray-300">{event.title}</h2>
                    <div className="text-gray-500 text-sm mb-2">
                      <span>{new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span> • <span>{event.time}</span>
                    </div>
                    <p className="text-gray-400 line-clamp-2">{event.description}</p>
                    <div className="mt-4 text-gray-400 font-medium">View Details →</div>
                  </div>
                </Link>
                
                {event.facebookEventUrl && (
                  <div className="px-4 pb-4 mt-auto">
                    <a 
                      href={event.facebookEventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 font-medium inline-block"
                    >
                      Facebook Event →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
} 