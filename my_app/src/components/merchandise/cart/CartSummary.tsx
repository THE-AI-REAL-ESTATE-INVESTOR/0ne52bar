'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from './CartContext';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

export function CartSummary() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const handlePlaceOrder = () => {
    // In the future, this will handle online payment
    setIsOrderComplete(true);
    clearCart();
  };

  if (isOrderComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-gray-900 text-gray-100">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="text-xl font-bold text-center text-gray-100">
          Thank you for your order!
        </h3>
        <p className="text-center text-gray-300">
          Total: ${total.toFixed(2)}
        </p>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-center text-gray-100 font-medium">
            Please pick up and pay for your merchandise at the bar.
          </p>
          <p className="text-center text-gray-400 text-sm mt-2">
            Online payment coming soon!
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-gray-900 text-gray-400">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      <DialogHeader className="border-b border-gray-800 px-4 py-3">
        <DialogTitle className="text-gray-100">Your Cart</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex-grow">
        <div className="space-y-4 p-4">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-start space-x-4 bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              {item.item.imagePath && (
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.item.imagePath}
                    alt={item.item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-100">{item.item.name}</h3>
                {item.size && (
                  <p className="text-sm text-gray-400">Size: {item.size}</p>
                )}
                <div className="flex items-center mt-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-8 bg-gray-700 border-gray-600 text-gray-100"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-red-400 hover:text-red-300 hover:bg-gray-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <div className="text-right text-gray-100">
                ${(parseFloat(item.item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-gray-800 p-4 space-y-4">
        <div className="flex justify-between text-lg font-bold text-gray-100">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button 
          onClick={handlePlaceOrder} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
} 