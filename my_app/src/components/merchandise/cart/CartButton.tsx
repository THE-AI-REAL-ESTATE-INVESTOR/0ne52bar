'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CartSummary } from './CartSummary';

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
        >
          <ShoppingCart className="h-5 w-5 text-gray-100" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <CartSummary />
      </DialogContent>
    </Dialog>
  );
} 