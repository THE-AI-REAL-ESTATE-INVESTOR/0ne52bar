'use client';

import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CartSummary } from './CartSummary';

export function CartButton() {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <CartSummary />
      </DialogContent>
    </Dialog>
  );
} 