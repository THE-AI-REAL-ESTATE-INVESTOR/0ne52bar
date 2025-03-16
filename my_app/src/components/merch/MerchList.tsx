'use client';

import React from 'react';
import type { Merchandise, MerchandiseCategory } from '@prisma/client';

type MerchandiseWithCategory = Merchandise & {
  category: MerchandiseCategory;
};

interface MerchListProps {
  initialItems: MerchandiseWithCategory[];
}

export default function MerchList({ initialItems }: MerchListProps) {
  const items = initialItems;

  const getIconForCategory = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('apparel') || name.includes('clothing')) return '👕';
    if (name.includes('drink') || name.includes('glass')) return '🍺';
    if (name.includes('hat') || name.includes('accessories')) return '🧢';
    return '🛍️';
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-12">ONE-52 Merchandise</h1>
      
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
        <p className="text-lg">Our merchandise store is under construction. Check back soon for awesome ONE-52 gear!</p>
      </div>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 relative">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                <div className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transform -rotate-12 text-xl">
                  Coming Soon
                </div>
              </div>
              
              <div className="relative h-64 w-full bg-gray-800 flex items-center justify-center opacity-60">
                {item.imagePath ? (
                  // If there's an actual image path
                  <img 
                    src={item.imagePath} 
                    alt={item.name} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  // Fallback to category icon
                  <div className="text-6xl">
                    {getIconForCategory(item.category.name)}
                  </div>
                )}
                
                {!item.inStock && !item.comingSoon && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 m-2 rounded-md">
                    Sold Out
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-yellow-400">{item.price}</span>
                  <button 
                    className="px-4 py-2 rounded-md bg-gray-700 text-gray-400 cursor-not-allowed"
                    disabled={true}
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-800 rounded-lg">
          <p className="text-gray-300 mb-4">No merchandise items available yet.</p>
        </div>
      )}
      
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4">Want to be notified when our merchandise becomes available?</p>
        <a 
          href="mailto:merch@one52bar.com?subject=Merchandise%20Notification%20Request" 
          className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
        >
          Sign Up for Updates
        </a>
      </div>
    </div>
  );
} 