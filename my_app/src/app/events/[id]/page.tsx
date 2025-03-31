import { getEvents, getEventById } from '@/actions/event-actions';
import { transformPrismaEvent } from '@/lib/utils/event-transform';
import type { Event } from '@/types/events';
import type { ApiResponse } from '@/types/api';
import type { Metadata } from 'next';
import Link from 'next/link';

interface EventParams {
  id: string;
}

interface Props {
  params: EventParams;
}

// Generate static params for all events
export async function generateStaticParams() {
  const eventsResult = await getEvents() as ApiResponse<Event[]>;
  
  if (!eventsResult.success || !eventsResult.data) {
    return [];
  }

  return eventsResult.data.map((event: Event) => ({
    id: event.id,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getEventById(params.id) as ApiResponse<Event | null>;
  
  if (!result.success || !result.data) {
    return {
      title: 'Event Not Found - ONE-52 Bar & Grill',
    };
  }
  
  const event = transformPrismaEvent(result.data);
  
  return {
    title: `${event.title} - ONE-52 Bar & Grill`,
    description: event.description,
  };
}

// The page component
export default async function EventPage({ params }: Props) {
  const result = await getEventById(params.id) as ApiResponse<Event | null>;
  
  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Event Not Found</h1>
            <p className="mt-4 text-gray-400">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const event = transformPrismaEvent(result.data);
  const formattedDate = new Date(event.date).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {event.image && (
            <div className="relative h-96 w-full">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            
            <div className="flex items-center gap-4 text-gray-400 mb-6">
              <div>
                <span className="font-semibold">Date:</span>{' '}
                {formattedDate}
              </div>
              <div>
                <span className="font-semibold">Time:</span> {event.time}
              </div>
              {event.isRecurring && event.recurringPattern && (
                <div className="text-blue-400">
                  <span className="font-semibold">Recurring:</span>{' '}
                  {event.recurringPattern.replace('WEEKLY_', 'Every ').replace('_', ' ')}
                </div>
              )}
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>

            <div className="mt-8 flex gap-4">
              {event.facebookEventUrl && (
                <a
                  href={event.facebookEventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View on Facebook
                </a>
              )}
              <Link
                href="/events"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
