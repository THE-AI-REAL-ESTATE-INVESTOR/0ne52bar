'use client';

import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus } from 'lucide-react';

export function CartSummary() {
  const { state, removeItem, updateQuantity, updateNotes } = useCart();

  if (state.items.length === 0) {
    return (
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <p className="text-gray-400 text-center">Your cart is empty</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-800">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-amber-500">Order Summary</h2>
        
        <div className="space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex flex-col space-y-2 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-200">{item.name}</h3>
                  <p className="text-gray-400">${item.price.toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                placeholder="Add notes for this item..."
                value={item.notes || ''}
                onChange={(e) => updateNotes(item.id, e.target.value)}
                className="bg-gray-900/50 border-gray-700"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total</span>
            <span className="text-xl font-semibold text-amber-500">
              ${state.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
} 