'use client';

import { type MenuItem } from '@prisma/client';

interface MenuDisplayProps {
  items: MenuItem[];
}

export default function MenuDisplay({ items }: MenuDisplayProps) {
  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Our Menu</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-0.5 w-6 bg-amber-500 mr-2"></div>
              <h2 className="text-2xl font-bold text-amber-500">{category.toUpperCase()}</h2>
              <div className="h-0.5 w-6 bg-amber-500 ml-2"></div>
            </div>
            
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between">
                    <p className="font-medium">{item.name}</p>
                    <p className="font-mono">{item.price}</p>
                  </div>
                  {item.description && (
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 