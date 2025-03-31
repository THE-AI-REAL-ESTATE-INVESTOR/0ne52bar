'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Merchandise } from '@prisma/client';

interface CartItem {
  id: string;
  quantity: number;
  item: Merchandise;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Merchandise, quantity: number, size?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Merchandise, quantity: number, size?: string) => {
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

  const removeItem = useCallback((itemId: string) => {
    setItems(items => items.filter(i => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems(items =>
      items.map(i =>
        i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter(i => i.quantity > 0)
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
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
} 