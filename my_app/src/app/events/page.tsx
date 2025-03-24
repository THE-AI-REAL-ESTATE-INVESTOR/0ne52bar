import { Suspense } from 'react';
import { getEvents } from '@/actions/event-actions';
import EventsClientPage from '@/components/events/EventsClientPage';
import { EventsPageSkeleton } from '@/components/events/EventsPageSkeleton';

// This is a Server Component
export default async function EventsPage() {
  // Fetch events on the server
  const eventsResult = await getEvents();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      <Suspense fallback={<EventsPageSkeleton />}>
        <EventsClientPage initialEvents={eventsResult.data} />
      </Suspense>
    </div>
  );
}