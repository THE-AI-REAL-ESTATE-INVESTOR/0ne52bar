import Link from 'next/link';
import { getAllEvents } from '@/services/alternativeEvents';

export default async function EventsPage() {
  // Get events from our alternative service (no Facebook API needed)
  const events = getAllEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link 
            href={`/Events/${event.id}`} 
            key={event.id}
            className="block bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {event.image && (
              <div className="h-48 bg-gray-800">
                {/* Image placeholder - in production you would use next/image */}
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  {event.image ? "Event Image" : "No Image"}
                </div>
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{event.title}</h2>
              <div className="text-gray-400 text-sm mb-2">
                <span>{event.date}</span> • <span>{event.time}</span>
              </div>
              <p className="text-gray-300 line-clamp-2">{event.description}</p>
              <div className="mt-4 text-blue-400 font-medium">View Details →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}