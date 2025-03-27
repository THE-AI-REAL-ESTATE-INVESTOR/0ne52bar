'use client';

import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import PersonalInfo from '@/components/tappass/form/PersonalInfo';
import { useState } from 'react';
import { createOrder } from '@/actions/orders';
import type { TapPassFormData } from '@/types/tappass';
import { useRouter } from 'next/navigation';

export function CartSummary() {
  const { state, clearCart, setPhoneNumber, setCustomerName } = useCart();
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Calculate subtotal
  const subtotal = state.items.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return sum + (price * item.quantity);
  }, 0);

  // Calculate tax (10%)
  const tax = subtotal * 0.1;

  // Calculate total
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!state.phoneNumber || !state.customerName) {
      setShowPhoneCollection(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await createOrder({
        items: state.items,
        total,
        phoneNumber: state.phoneNumber,
        customerName: state.customerName
      });

      if (result.success) {
        clearCart();
        // Redirect to merch page after successful order
        router.push('/merch');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoComplete = (data: Partial<TapPassFormData>) => {
    if (data.phoneNumber) setPhoneNumber(data.phoneNumber);
    if (data.name) setCustomerName(data.name);
    setShowPhoneCollection(false);
    handleCheckout();
  };

  if (state.items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        Your cart is empty
      </div>
    );
  }

  if (showPhoneCollection) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Complete Your Order</h2>
        <PersonalInfo
          onNext={handlePersonalInfoComplete}
          initialData={{
            phoneNumber: state.phoneNumber,
            name: state.customerName
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-white">Order Summary</h2>
      
      <div className="space-y-2">
        {state.items.map((item) => {
          const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
          return (
            <div key={item.id} className="flex justify-between text-gray-300">
              <span>{item.name} × {item.quantity}</span>
              <span>${(price * item.quantity).toFixed(2)}</span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-700 pt-4 space-y-2">
        <div className="flex justify-between text-gray-300">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        className="w-full bg-amber-600 hover:bg-amber-700"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>
    </div>
  );
} 