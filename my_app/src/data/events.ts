import { Event } from '@/types';

export const events: Event[] = [
  {
    id: "1",
    title: "KOBY ALLEN LIVE @ ONE-52",
    date: "2025-03-14",
    time: "7:00 PM",
    description: "🎶 ONE-52 Bar and Grill PRESENTS:\nKOBY ALLEN LIVE! 🎶\nOne-52 Bar & Grill | Mustang, OK\n🔥 Get ready for a night of real country, great vibes, and ice-cold drinks!\nKoby Allen is bringing his signature sound to One-52 Bar, and you won't want to miss it! This place is always packed when Koby comes to town.\n🥃 Live music, local legends, and a bar full of good times!\nTag your crew, grab your boots, and let's make it a night to remember! 🤠🎸",
    image: "/assets/food/charchters/Kolby-allen.jpg",
    facebookEventUrl: "https://www.facebook.com/events/2008133716362208"
  },
  {
    id: "2",
    title: "🍀 Shamrock Shandy's St. Paddy's Bash at One-52 Bar! 🍀",
    date: "2025-03-17",
    time: "12:00 PM",
    description: "Aye, me lucky friends! It's that time o' year when we paint the town GREEN! Join us for the biggest St. Paddy's Day bash in Mustang!\n\n🎉 Monday, March 17 | Kicks off at 12 PM 🎉\n\n🍻 Drinks flowing all day! 🍻\n☘️ Green Beer – 'cause what's St. Paddy's Day without it?\n🥃 Jameson Shots – smooth as an Irish jig!\n🍏 Irish Apple – a crisp & tasty kick!\n🍹 Irish Trash Can – for those feeling extra lucky!\n\nWear green, bring friends, and celebrate St. Patrick's Day the ONE-52 way!",
    image: "/assets/food/charchters/shandy-shamrock.jpg",
    facebookEventUrl: "https://www.facebook.com/events/4065354673720986"
  },
  {
    id: "3",
    title: "COUNTRY WESTERN LIVE! JAKE B TIMMY T AND GARRETT T",
    date: "2025-03-21",
    time: "7:00 PM",
    description: "Get ready for an unforgettable night of boot-stompin', heart-thumpin' LIVE country music featuring three of Oklahoma's most talented performers! Jake B, Timmy T, and Garrett T are bringing their raw talent and authentic country sound to ONE-52 Bar & Grill for one night only!\n\nWhy go home after work when you can kick off your evening with us? Arrive at 5PM to grab the best seats in the house, hang out with our amazing ONE-52 bar staff, enjoy pre-show drink specials, and build the excitement with fellow country music lovers!\n\n🔥 SPECIAL OFFER: $3 FIREBALL SHOTS ALL NIGHT! 🔥\n\nYou haven't experienced true Oklahoma country until you've seen these boys perform live! Their authentic sound and energetic stage presence will have you two-stepping all night long!",
    image: "/assets/food/charchters/JAKE-B-TImmy-t-Garrett-T-mar-21.jpg",
    facebookEventUrl: "https://www.facebook.com/one52Barandgrill/events"
  },
  {
    id: "4",
    title: "Thursday Night Pool League",
    date: "2025-03-20",
    time: "7:00 PM",
    description: "Join us every Thursday night for our weekly Pool League! Whether you're a seasoned player or just looking to have some fun, our Pool League is open to all skill levels. Bring your friends, enjoy some drinks, and show off your pool skills!\n\nCompetition starts at 7pm sharp. Weekly prizes for winners and season-long standings with grand prizes at the end of the season. $5 entry fee per player.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2074&auto=format&fit=crop",
    facebookEventUrl: "https://www.facebook.com/one52Barandgrill/events"
  },
  {
    id: "5",
    title: "Halloween Karaoke Party",
    date: "2025-10-31",
    time: "8:00 PM",
    description: "Dress up in your best costume and sing your heart out! Prizes for best costumes and best performances. No cover charge.",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
    facebookEventUrl: "https://www.facebook.com/one52Barandgrill/events"
  },
  {
    id: "6",
    title: "New Year's Eve Party",
    date: "2025-12-31",
    time: "8:00 PM",
    description: "Ring in the New Year with us! Live music, champagne toast at midnight, and party favors included. Reservations recommended.",
    image: "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=2036&auto=format&fit=crop",
    facebookEventUrl: "https://www.facebook.com/one52Barandgrill/events"
  }
];

export function getEvent(id: string): Event | undefined {
  return events.find(event => event.id === id);
}

export function getAllEvents(): Event[] {
  return events;
} 