import { getEvent, getAllEvents, getAllPastEvents } from '@/services/alternativeEvents';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Define the params type for this page
type EventParams = { id: string };

// Generate static params for all events
export async function generateStaticParams() {
  const upcomingEvents = getAllEvents();
  const pastEvents = getAllPastEvents();
  const allEvents = [...upcomingEvents, ...pastEvents];
  
  return allEvents.map((event) => ({
    id: event.id,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: EventParams 
}): Promise<Metadata> {
  const event = getEvent(params.id);
  
  if (!event) {
    return {
      title: 'Event Not Found - ONE-52 Bar & Grill',
    };
  }
  
  return {
    title: `${event.title} - ONE-52 Bar & Grill`,
    description: event.description,
  };
}

// The page component
export default function EventPage({ 
  params 
}: { 
  params: EventParams 
}) {
  const event = getEvent(params.id);
  
  // If event doesn't exist, show 404
  if (!event) {
    notFound();
  }

  // Format the date
  const formattedDate = (() => {
    // Create date with time set to noon to avoid timezone issues
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day, 12, 0, 0);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  })();

  // Determine if event is in the past
  const isPastEvent = event.id.startsWith('past-');

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/events" className="text-blue-400 hover:underline mb-6 inline-block">
        ← Back to all events
      </Link>
      
      <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-xl ${isPastEvent ? 'opacity-90' : ''}`}>
        {event.image && (
          <div className={`h-64 md:h-80 bg-gray-800 relative ${isPastEvent ? 'grayscale hover:grayscale-0 transition-all duration-500' : ''}`}>
            <Image
              src={event.image}
              alt={event.title}
              fill
              style={{objectFit: 'cover'}}
              priority
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-400 uppercase">Date</h3>
                <p className="text-lg">{formattedDate}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 uppercase">Time</h3>
                <p className="text-lg">{event.time}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3 border-b border-gray-800 pb-2">Details</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
          
          {!isPastEvent && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link 
                href={event.facebookEventUrl || "#"} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-center font-medium"
              >
                RSVP for this Event
              </Link>
              <Link 
                href="tel:4052565005" 
                className="border border-white text-white py-3 px-6 rounded-lg text-center font-medium hover:bg-white hover:text-black transition-colors"
              >
                Call for Details
              </Link>
            </div>
          )}
          
          {isPastEvent && (
            <div className="mt-8 flex justify-center">
              <div className="bg-gray-800 text-gray-300 py-2 px-4 rounded-full text-sm">
                This event has already taken place
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
