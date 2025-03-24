'use client';

import React from 'react';

const benefits = {
  BRONZE: [
    'Welcome drink on signup',
    'Birthday special',
    'Points for every visit',
  ],
  SILVER: [
    'All Bronze benefits',
    'Priority seating',
    'Double points on weekdays',
  ],
  GOLD: [
    'All Silver benefits',
    'VIP event access',
    'Triple points on weekends',
    'Free appetizer monthly',
  ],
  PLATINUM: [
    'All Gold benefits',
    'Exclusive tastings',
    'Personal concierge',
    'Reserved parking',
    'Quadruple points always',
  ],
};

interface BenefitCardsProps {
  selectedTier?: keyof typeof benefits;
}

const BenefitCards: React.FC<BenefitCardsProps> = ({ selectedTier }) => {
  const tiers = Object.keys(benefits) as Array<keyof typeof benefits>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {tiers.map((tier) => (
        <div
          key={tier}
          className={`p-4 rounded-lg shadow-md ${
            selectedTier === tier ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <h3 className="text-lg font-bold mb-2">{tier}</h3>
          <ul className="list-disc list-inside space-y-2">
            {benefits[tier].map((benefit, index) => (
              <li key={index} className="text-sm">
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BenefitCards; 