'use client';

import React from 'react';
import Image from 'next/image';
import { useMerchCart } from '@/contexts/MerchCartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart } from 'lucide-react';

export function MerchCart() {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useMerchCart();

  if (itemCount === 0) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {itemCount}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-4 mt-4">
            {items.map((cartItem) => (
              <div key={`${cartItem.id}-${cartItem.size}`} className="flex items-start space-x-4 p-4 bg-gray-100 rounded-lg">
                {cartItem.item.imagePath && (
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={cartItem.item.imagePath}
                      alt={cartItem.item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h3 className="font-medium">{cartItem.item.name}</h3>
                  {cartItem.size && (
                    <p className="text-sm text-gray-600">Size: {cartItem.size}</p>
                  )}
                  <div className="flex items-center mt-2">
                    <Input
                      type="number"
                      min="1"
                      value={cartItem.quantity}
                      onChange={(e) => updateQuantity(cartItem.id, parseInt(e.target.value) || 0)}
                      className="w-20 h-8"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(cartItem.id)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  ${(parseFloat(cartItem.item.price) * cartItem.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t mt-4 pt-4 space-y-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
} 