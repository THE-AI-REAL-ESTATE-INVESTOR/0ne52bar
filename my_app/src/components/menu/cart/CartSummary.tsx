'use client';

import { useCart } from './CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { createOrder } from '@/actions/orders';
import { useRouter } from 'next/navigation';
import { TapPassSignup } from './TapPassSignup';
import { checkMembershipByPhone } from '@/app/tappass/actions';

export function CartSummary() {
  const { state, clearCart, setCustomer } = useCart();
  const [showPhoneCollection, setShowPhoneCollection] = useState(false);
  const [showTapPassSignup, setShowTapPassSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  // Calculate subtotal
  const subtotal = state.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Calculate tax (10%)
  const tax = subtotal * 0.1;

  // Calculate total
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!phoneNumber || !name) {
      setShowPhoneCollection(true);
      return;
    }

    setIsLoading(true);
    try {
      // First create the order
      const result = await createOrder({
        items: state.items,
        total,
        phoneNumber,
        customerName: name
      });

      if (result.success) {
        // Set customer info in cart context
        setCustomer(phoneNumber, name);
        
        // Check for existing TapPass membership
        const membershipResult = await checkMembershipByPhone(phoneNumber);
        
        if (membershipResult.success) {
          // If they're already a member, just clear cart and redirect to dashboard
          clearCart();
          router.push('/tappass/dashboard');
        } else {
          // Show TapPass signup offer for new customers
          setShowTapPassSignup(true);
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckout();
  };

  const handleSkipTapPass = () => {
    setShowTapPassSignup(false);
    // Clear the cart and redirect to merch page after skipping TapPass
    clearCart();
    router.push('/merch');
  };

  if (state.items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        Your cart is empty
      </div>
    );
  }

  if (showTapPassSignup) {
    return <TapPassSignup 
      orderTotal={total}
      customerName={name}
      phoneNumber={phoneNumber}
      onSkip={handleSkipTapPass}
      clearCart={clearCart}
    />;
  }

  if (showPhoneCollection) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Complete Your Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-700"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="bg-gray-800/50 border-gray-700"
              placeholder="(555) 555-5555"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold text-white">Order Summary</h2>
      
      <div className="space-y-2">
        {state.items.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-300">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
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