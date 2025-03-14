import Link from 'next/link';
import { UpcomingEvents } from '@/components/UpcomingEvents';
import { getAllEvents } from '@/services/alternativeEvents';

// Force dynamic rendering for this page to avoid CSS issues with Next.js 15
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Get all events
  const allEvents = getAllEvents();
  
  // Get the three 2025 events which should be displayed first
  const upcomingEvents = allEvents
    .filter(event => {
      // Extract the year from the date string
      const eventYear = new Date(event.date).getFullYear();
      // We want to show 2025 events first
      return eventYear === 2025;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  console.log('Upcoming events:', upcomingEvents.map(e => e.title));
  
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
          {upcomingEvents.length > 0 ? (
            <UpcomingEvents events={upcomingEvents} />
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