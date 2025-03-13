import { Event } from '@/types';

export const events: Event[] = [
  {
    id: "1",
    title: "Live Music Friday - The Local Band",
    date: "2023-12-15",
    time: "8:00 PM - 11:00 PM",
    description: "Join us for an evening of great music with The Local Band. Enjoy drink specials all night!",
    image: "/images/events/live-music.jpg"
  },
  {
    id: "2",
    title: "Pool Tournament",
    date: "2023-12-20",
    time: "7:00 PM - 10:00 PM",
    description: "Weekly pool tournament with cash prizes! $10 entry fee, winner takes all.",
    image: "/images/events/pool-tournament.jpg"
  },
  {
    id: "3",
    title: "Taco Tuesday Special",
    date: "2023-12-19",
    time: "5:00 PM - 10:00 PM",
    description: "$1 tacos all night and $3 margaritas. Come hungry!",
    image: "/images/events/taco-tuesday.jpg"
  },
  {
    id: "4",
    title: "Poker Night",
    date: "2023-12-22",
    time: "7:00 PM - 12:00 AM",
    description: "Texas Hold'em tournament. $20 buy-in with prizes for top finishers.",
    image: "/images/events/poker-night.jpg"
  }
];

export function getEvent(id: string): Event | undefined {
  return events.find(event => event.id === id);
}

export function getAllEvents(): Event[] {
  return events;
} 