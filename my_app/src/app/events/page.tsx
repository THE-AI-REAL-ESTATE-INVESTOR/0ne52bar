import { getAllEvents } from '@/actions/event-queries';
import { transformPrismaEvent } from '@/lib/utils/event-transform';
import { EventsList } from '@/components/events/EventsList';
import type { Event } from '@prisma/client';

export default async function EventsPage() {
  // Get all events
  const eventsResponse = await getAllEvents();
  
  // Handle error case
  if (!eventsResponse || !('success' in eventsResponse) || !eventsResponse.success) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Events</h1>
          <p className="text-gray-400 text-center">Unable to load events at this time.</p>
        </div>
      </main>
    );
  }

  // Get current date for comparison
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Transform and split events into upcoming and past
  const allEvents = eventsResponse.data
    .map(transformPrismaEvent);

  const upcomingEvents = allEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = allEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Events</h1>
        
        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <EventsList events={upcomingEvents} title="Upcoming Events" />
          </section>
        )}

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <section className="mt-16 pt-8 border-t border-gray-700">
            <EventsList events={pastEvents} title="Past Events" />
          </section>
        )}

        {/* No Events Message */}
        {!upcomingEvents.length && !pastEvents.length && (
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <p className="text-xl">No events to display at this time.</p>
            <p className="mt-2 text-gray-400">Check back soon for new events!</p>
          </div>
        )}
      </div>
    </main>
  );
}