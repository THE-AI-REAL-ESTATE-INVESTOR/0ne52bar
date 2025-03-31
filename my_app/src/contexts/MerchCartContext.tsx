'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Merchandise } from '@prisma/client';

interface CartItem {
  id: string;
  quantity: number;
  item: Merchandise;
  size?: string; // Optional size for apparel
}

interface MerchCartContextType {
  items: CartItem[];
  addToCart: (item: Merchandise, quantity: number, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSize: (itemId: string, size: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const MerchCartContext = createContext<MerchCartContextType | null>(null);

export function useMerchCart() {
  const context = useContext(MerchCartContext);
  if (!context) {
    throw new Error('useMerchCart must be used within a MerchCartProvider');
  }
  return context;
}

export function MerchCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Merchandise, quantity: number, size?: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        i => i.id === item.id && i.size === size
      );

      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...currentItems, { id: item.id, item, quantity, size }];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(items => items.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems(items =>
      items.map(i =>
        i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter(i => i.quantity > 0)
    );
  }, []);

  const updateSize = useCallback((itemId: string, size: string) => {
    setItems(items =>
      items.map(i => (i.id === itemId ? { ...i, size } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.item.price) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MerchCartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </MerchCartContext.Provider>
  );
} 