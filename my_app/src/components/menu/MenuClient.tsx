'use client';

import { MenuDisplay } from './MenuDisplay';
import { CartProvider } from './cart/CartContext';
import { CartButton } from './cart/CartButton';
import type { MenuItemWithCategory } from '@/types/menu';

interface MenuClientProps {
  items: MenuItemWithCategory[];
}

export function MenuClient({ items }: MenuClientProps) {
  return (
    <CartProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-500">Menu</h1>
          <CartButton />
        </div>
        <MenuDisplay items={items} />
      </div>
    </CartProvider>
  );
} 