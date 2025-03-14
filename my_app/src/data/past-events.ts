import { Event } from '@/types';

export const pastEvents: Event[] = [
  {
    id: "past-1",
    title: "JLJB @ ONE-52 BAR & GRILL - ACOUSTIC CONCERT",
    date: "2024-01-17",
    time: "8:00 PM",
    description: "Join us for an evening of great acoustic music with the Jimmy Lee Jordan Band. Great drinks, great atmosphere, and unforgettable performances at ONE-52 Bar and Grill.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop"
  },
  {
    id: "past-2",
    title: "LIVE MUSIC - KOBY ALLEN",
    date: "2024-01-03",
    time: "9:00 PM",
    description: "🎶 ONE-52 Bar and Grill PRESENTS: KOBY ALLEN LIVE! Get ready for a night of real country, great vibes, and ice-cold drinks! Koby Allen is bringing his signature sound to One-52 Bar.",
    image: "/assets/food/charchters/Kolby-allen.jpg"
  },
  {
    id: "past-3",
    title: "LIVE MUSIC! Alisha Marie & Koby!!!",
    date: "2023-10-25",
    time: "8:00 PM",
    description: "Don't miss this incredible duo performing live at ONE-52 Bar! Alisha Marie & Koby are bringing their amazing talents for a night of unforgettable music and entertainment.",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "past-4",
    title: "LIVE MUSIC! CONNOR WILSON!",
    date: "2023-08-23",
    time: "8:00 PM",
    description: "Join us for an amazing night of live music with Connor Wilson! Great drinks, great atmosphere, and unforgettable performances at ONE-52 Bar and Grill.",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2071&auto=format&fit=crop"
  },
  {
    id: "past-5",
    title: "LIVE MUSIC! TYLER RUSSELL!",
    date: "2023-08-09",
    time: "8:00 PM",
    description: "Tyler Russell is coming to ONE-52 Bar and Grill! Don't miss this opportunity to hear one of Oklahoma's rising talents perform live in an intimate setting.",
    image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=2036&auto=format&fit=crop"
  },
  {
    id: "past-6",
    title: "LIVE LOCAL MUSIC! Timmy and Jake!",
    date: "2023-07-19",
    time: "8:00 PM",
    description: "Come support local musicians Timmy and Jake as they bring their unique sound to ONE-52 Bar and Grill. Great music, great drinks, and great times!",
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: "past-7",
    title: "LIVE MUSIC! SCOTT LOWBER!",
    date: "2023-06-28",
    time: "8:00 PM",
    description: "Scott Lowber returns to ONE-52 Bar and Grill for another night of incredible live music! Don't miss this fan favorite performer.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "past-8",
    title: "LIVE MUSIC! Caleb Robertson & Cory Garrard!",
    date: "2023-06-21",
    time: "8:00 PM",
    description: "Join us for a special collaboration as Caleb Robertson & Cory Garrard take the stage at ONE-52 Bar and Grill! Two amazing talents for one unforgettable night.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069&auto=format&fit=crop"
  }
];

export function getPastEvent(id: string): Event | undefined {
  return pastEvents.find(event => event.id === id);
}

export function getAllPastEvents(): Event[] {
  return pastEvents;
} 