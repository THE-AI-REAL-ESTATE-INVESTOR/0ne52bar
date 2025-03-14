import Link from 'next/link';
import { getAllEvents, getAllPastEvents } from '@/services/alternativeEvents';
import Image from 'next/image';

export default async function EventsPage() {
  // Get events from our service
  const allEvents = getAllEvents();
  const pastEvents = getAllPastEvents();
  
  // Sort upcoming events by date (closest date first)
  const upcomingEvents = [...allEvents]
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  console.log('Events page events:', upcomingEvents.map(e => `${e.title} (${e.date})`));
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Upcoming Events Section */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Link 
              href={`/events/${event.id}`} 
              key={event.id}
              className="block bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {event.image && (
                <div className="h-48 bg-gray-800 relative">
                  {/* Use actual images instead of placeholders */}
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
                <div className="mt-4 text-blue-400 font-medium">View Details →</div>
              </div>
            </Link>
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
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center border-t border-gray-700 pt-12">Past Events</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <Link 
              href={`/events/${event.id}`} 
              key={event.id}
              className="block bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow opacity-90 hover:opacity-100"
            >
              {event.image && (
                <div className="h-48 bg-gray-800 relative grayscale hover:grayscale-0 transition-all">
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
                <div className="mt-4 text-blue-400 font-medium">View Details →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}