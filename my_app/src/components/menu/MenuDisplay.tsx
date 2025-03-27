'use client';

import { useState } from 'react';
import { MenuItemWithCategory, CartItem } from '@/types/menu';
import { useCart } from './cart/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface MenuDisplayProps {
  items: MenuItemWithCategory[];
}

export function MenuDisplay({ items }: MenuDisplayProps) {
  const { addItem, removeItem, state } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItemWithCategory | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAddItem = (item: MenuItemWithCategory) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      quantity,
      notes: notes.trim() || undefined,
    };
    addItem(cartItem);
    setSelectedItem(null);
    setQuantity(1);
    setNotes('');
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
                    <p className="text-lg font-bold">${item.price}</p>
                    <div className="mt-4 flex items-center justify-between">
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
                        onClick={() => setSelectedItem(item)}
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

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold">{selectedItem.name}</h3>
            <div className="space-y-2">
              <label className="block">
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                  className="ml-2 border rounded px-2 py-1"
                />
              </label>
              <label className="block">
                Notes:
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full border rounded px-2 py-1 mt-1"
                  rows={3}
                  placeholder="Special instructions..."
                />
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddItem(selectedItem)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 