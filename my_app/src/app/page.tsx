import Link from 'next/link';
import { UpcomingEvents } from '@/components/UpcomingEvents';
import { getHomePageEvents, getAllEvents } from '@/actions/event-queries';
import { transformPrismaEvent } from '@/lib/utils/event-transform';

// Force dynamic rendering for this page to avoid CSS issues with Next.js 15
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Get events for home page
  const eventsResult = await getHomePageEvents();
  const allEventsResult = await getAllEvents();
  
  // Ensure we have valid data and transform events
  const { upcomingEvents = [] } = 'success' in eventsResult && eventsResult.success && eventsResult.data ? eventsResult.data : {};
  const transformedUpcomingEvents = upcomingEvents.map(event => transformPrismaEvent({
    ...event,
    date: event.date.toISOString()
  }));
  
  // Get the three 2025 events which should be displayed first
  const featuredEvents = transformedUpcomingEvents
    .filter(event => {
      // Extract the year from the date string
      const eventYear = event.date ? new Date(event.date).getFullYear() : 0;
      // We want to show 2025 events first
      return eventYear === 2025;
    })
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 3);

  // Get past events
  const pastEvents = 'success' in allEventsResult && allEventsResult.success && allEventsResult.data
    ? allEventsResult.data
        .map(event => transformPrismaEvent({
          ...event,
          date: event.date.toISOString()
        }))
        .filter(event => {
          const eventDate = new Date(event.date);
          return eventDate < new Date();
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];
  
  console.log('Featured events:', featuredEvents.map(e => e.title || 'Untitled Event'));
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ONE-52 BAR AND GRILL</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover our upcoming events and join us for great food, drinks, and unforgettable moments.
          </p>
          <Link 
            href="/tappass" 
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-medium transition duration-300 inline-block transform hover:scale-105 shadow-lg"
          >
            Sign up for your TapPass today for exclusive ONE-52 deals!
          </Link>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {featuredEvents.length > 0 ? (
            <UpcomingEvents events={featuredEvents} />
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
              <div className="text-center text-gray-600 py-8">
                <p className="text-lg mb-4">No upcoming events found</p>
                <p>Check back later for new events or visit our Facebook page.</p>
              </div>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              href="/events" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Past Events</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {event.image && (
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-2">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              <p className="text-lg">No past events found</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">ONE-52 BAR AND GRILL</h3>
              <p className="text-gray-400 mt-1">Great drinks, great times.</p>
            </div>
            <div>
              <p className="text-gray-400">© {new Date().getFullYear()} 152 Bar. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 