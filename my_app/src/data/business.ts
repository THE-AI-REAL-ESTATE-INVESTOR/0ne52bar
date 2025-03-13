import { BusinessInfo } from '@/types';

export const businessInfo: BusinessInfo = {
  name: "ONE-52 BAR & GRILL",
  description: "One-52 Bar and Grill is a great Mustang hangout for locals and visitors alike. This family-owned bar makes guests feel right at home with comfort food favorites, weekly live music and plenty of entertainment options. Stop in for a game of pool, darts or poker, and stick around for live music each Friday evening. While you're enjoying the friendly atmosphere, share a plate of nachos or fried pickles with your crew. For entree choices, dig into an assortment of delicious tacos, burgers, wings and other bar-style staples. Pair your food with a local brew on tap for the complete One-52 experience.",
  address: {
    street: "211 Trade Center Terrace",
    city: "Mustang",
    state: "OK",
    zip: "73064"
  },
  phone: "405-256-5005",
  hours: [
    { day: "Sunday", hours: "2:00 pm - 2:00 am" },
    { day: "Monday", hours: "12:00 pm - 2:00 am" },
    { day: "Tuesday", hours: "12:00 pm - 2:00 am" },
    { day: "Wednesday", hours: "12:00 pm - 2:00 am" },
    { day: "Thursday", hours: "12:00 pm - 2:00 am" },
    { day: "Friday", hours: "12:00 pm - 2:00 am" },
    { day: "Saturday", hours: "12:00 pm - 2:00 am" }
  ],
  amenities: [
    "ADA Compliant",
    "Credit Cards Accepted",
    "Full Bar",
    "Handicapped Parking",
    "Live Entertainment"
  ]
};

export function getBusinessInfo(): BusinessInfo {
  return businessInfo;
} 