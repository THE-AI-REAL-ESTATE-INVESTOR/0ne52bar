'use client';

import React from 'react';
import Image from 'next/image';
import { Event } from '@prisma/client';
import { cn } from '@/lib/utils';

interface EventsCardProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onToggleShowPastDate: (id: string, show: boolean) => void;
}

export function EventsCard({ events, onEdit, onDelete, onToggleShowPastDate }: EventsCardProps) {
  const [activeTab, setActiveTab] = React.useState<'upcoming' | 'past'>('upcoming');
  
  // Get current date for comparison
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Split events into upcoming and past
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium",
            activeTab === 'upcoming'
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium",
            activeTab === 'past'
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'upcoming' ? upcomingEvents : pastEvents).map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden">
              {event.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                <div className="text-sm text-gray-400 mb-2">
                  {formatDate(event.date)} • {event.time}
                </div>
                {event.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}
                {event.facebookEventUrl && (
                  <a
                    href={event.facebookEventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 text-sm hover:text-blue-300 mb-4 block"
                  >
                    Facebook Event →
                  </a>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(event)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  {activeTab === 'past' && (
                    <button
                      onClick={() => onToggleShowPastDate(event.id, !event.showPastDate)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm",
                        event.showPastDate
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
                      )}
                    >
                      {event.showPastDate ? 'Hide Date' : 'Show Date'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'upcoming' && upcomingEvents.length === 0) ||
          (activeTab === 'past' && pastEvents.length === 0)) && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No {activeTab} events found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 