'use client';

import type { MenuItem, Category } from '@prisma/client';

type MenuItemWithCategory = MenuItem & {
  Category: Category & {
    sortOrder: number;
    description?: string;
  };
};

interface MenuDisplayProps {
  items: MenuItemWithCategory[];
}

export default function MenuDisplay({ items }: MenuDisplayProps) {
  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.Category;
    if (!category) return acc;
    
    if (!acc[category.id]) {
      acc[category.id] = {
        category,
        items: []
      };
    }
    acc[category.id].items.push(item);
    return acc;
  }, {} as Record<string, { category: MenuItemWithCategory['Category']; items: MenuItem[] }>);

  // Sort categories by sortOrder
  const sortedCategories = Object.values(itemsByCategory).sort(
    (a, b) => a.category.sortOrder - b.category.sortOrder
  );

  return (
    <div className="space-y-8">
      {sortedCategories.map(({ category, items }) => (
        <div key={category.id} className="space-y-4">
          <h2 className="text-xl font-semibold">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="mt-2 font-semibold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 