'use client';

import { useCart } from './cart/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import type { MenuItem, Category } from '@prisma/client';

type MenuItemWithCategory = MenuItem & {
  category: Category & {
    sortOrder: number;
    description?: string;
  };
};

interface MenuDisplayProps {
  items: MenuItemWithCategory[];
}

export default function MenuDisplay({ items }: MenuDisplayProps) {
  const { addItem, removeItem, state } = useCart();

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category.id]) {
      acc[category.id] = {
        category,
        items: []
      };
    }
    acc[category.id].items.push(item);
    return acc;
  }, {} as Record<string, { category: MenuItemWithCategory['category']; items: MenuItem[] }>);

  // Sort categories by sortOrder
  const sortedCategories = Object.values(itemsByCategory).sort(
    (a, b) => a.category.sortOrder - b.category.sortOrder
  );

  return (
    <div className="space-y-8">
      {sortedCategories.map(({ category, items }) => (
        <div key={category.id} className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-500">{category.name}</h2>
          {category.description && (
            <p className="text-gray-400">{category.description}</p>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const cartItem = state.items.find(cartItem => cartItem.id === item.id);
              const quantity = cartItem?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-200">{item.name}</h3>
                  <p className="text-gray-400">{item.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold text-amber-500">${parseFloat(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      {quantity > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                        >
                          <Minus className="h-4 w-4 text-amber-500" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addItem(item)}
                        className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4 text-amber-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 