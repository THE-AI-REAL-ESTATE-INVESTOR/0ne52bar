'use client';

import { MenuItemWithCategory, CartItem } from '@/types/menu';
import { useCart } from './cart/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface MenuDisplayProps {
  items: MenuItemWithCategory[];
}

export function MenuDisplay({ items }: MenuDisplayProps) {
  const { addItem, removeItem, updateQuantity, state } = useCart();

  const handleAddItem = (item: MenuItemWithCategory) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price.replace('$', '')),
      quantity: 1,
    };
    addItem(cartItem);
  };

  const handleDecrementItem = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else {
      removeItem(itemId);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category.name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItemWithCategory[]>);

  const sortedCategories = Object.keys(groupedItems).sort();

  return (
    <div className="space-y-8">
      {sortedCategories.map(category => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-bold">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedItems[category]
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map(item => {
                const cartItem = state.items.find(cartItem => cartItem.id === item.id);
                const quantity = cartItem?.quantity || 0;

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    {item.description && (
                      <p className="text-gray-600">{item.description}</p>
                    )}
                    <p className="text-lg font-bold">{item.price}</p>
                    <div className="mt-4 flex items-center justify-between">
                      {quantity > 0 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDecrementItem(item.id, quantity)}
                          className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                        >
                          <Minus className="h-4 w-4 text-amber-500" />
                        </Button>
                      )}
                      {quantity > 0 && (
                        <span className="text-amber-500 font-semibold">{quantity}</span>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddItem(item)}
                        className="h-8 w-8 bg-gray-800 border-gray-700 hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4 text-amber-500" />
                      </Button>
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