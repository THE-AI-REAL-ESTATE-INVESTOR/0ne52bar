'use client';

import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { CartSummary } from './CartSummary';

export function CartButton() {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="bg-black text-amber-500 rounded-full h-5 w-5 flex items-center justify-center text-sm">
              {itemCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <DialogTitle className="text-lg font-semibold text-gray-100">Your Cart</DialogTitle>
        <DialogDescription className="text-sm text-gray-400">
          Review your items before checkout
        </DialogDescription>
        <CartSummary />
      </DialogContent>
    </Dialog>
  );
} 