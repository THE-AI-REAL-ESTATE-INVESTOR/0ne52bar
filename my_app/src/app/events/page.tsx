import { Suspense } from 'react';
import { getAllEvents } from '@/actions/event-queries';
import EventsClientPage from '@/components/events/EventsClientPage';
import { EventsPageSkeleton } from '@/components/events/EventsPageSkeleton';
import type { Event } from '@/types/events';

// This is a Server Component
export default async function EventsPage() {
  // Fetch events on the server
  const eventsResult = await getAllEvents();
  
  // Ensure we have valid data
  const events = eventsResult.success && eventsResult.data ? eventsResult.data : [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Events</h1>
      
      <Suspense fallback={<EventsPageSkeleton />}>
        <EventsClientPage initialEvents={events} />
      </Suspense>
    </div>
  );
}