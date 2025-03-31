'use client';

import { CartProvider } from '@/components/merchandise/cart/CartContext';
import { CartButton } from '@/components/merchandise/cart/CartButton';

export default function MerchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="relative">
        <div className="fixed top-4 right-4 z-50">
          <CartButton />
        </div>
        {children}
      </div>
    </CartProvider>
  );
} 