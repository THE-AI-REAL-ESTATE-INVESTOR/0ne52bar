import { getHomePageEvents } from '@/actions/event-queries';
import { transformPrismaEvent } from '@/lib/utils/event-transform';
import { EventsList } from '@/components/events/EventsList';
import { Hero } from '@/components/hero/Hero';
import Link from 'next/link';

// Force dynamic rendering for this page to avoid CSS issues with Next.js 15
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Get events for the homepage
  const eventsResponse = await getHomePageEvents();
  console.log('Events response:', eventsResponse);

  if (!('success' in eventsResponse) || !eventsResponse.success) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <Hero />
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400 text-center">Unable to load events at this time.</p>
          </div>
        </section>
      </main>
    );
  }

  // Get current date for comparison
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Filter and transform events
  const allEvents = eventsResponse.data.pastEvents
    .filter(event => event.isActive && event.isPublic)
    .map(transformPrismaEvent);

  // Split into upcoming and past events
  const upcomingEvents = allEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const pastEvents = allEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Hero />
      
      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <EventsList events={upcomingEvents} title="Upcoming Events" />
            <div className="mt-8 text-center">
              <Link 
                href="/events" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && !upcomingEvents.length && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <EventsList events={pastEvents} title="Past Events" />
            <div className="mt-8 text-center">
              <Link 
                href="/events" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Events
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* No Events Message */}
      {!upcomingEvents.length && !pastEvents.length && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400 text-center">No events to display at this time.</p>
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">152 Bar</h3>
              <p>Your premier destination for nightlife and entertainment.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/events" className="hover:text-amber-500">Events</Link></li>
                <li><Link href="/tappass" className="hover:text-amber-500">TapPass</Link></li>
                <li><Link href="/contact" className="hover:text-amber-500">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-amber-500">Facebook</a>
                <a href="#" className="hover:text-amber-500">Instagram</a>
                <a href="#" className="hover:text-amber-500">Twitter</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} 152 Bar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 