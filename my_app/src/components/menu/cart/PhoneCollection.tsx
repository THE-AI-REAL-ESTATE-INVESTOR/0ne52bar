'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';

interface PhoneCollectionProps {
  onComplete: (phoneNumber: string, name: string) => void;
  onCancel: () => void;
}

export function PhoneCollection({ onComplete, onCancel }: PhoneCollectionProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wantTapPass, setWantTapPass] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onComplete(phoneNumber, name);
    } catch (error) {
      console.error('Error processing form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTapPassSignup = () => {
    router.push('/tappass/signup');
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Almost there!</h2>
        <p className="text-gray-400">
          We need a few details to complete your order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-gray-800/50 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 555-5555"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="bg-gray-800/50 border-gray-700"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tappass"
            checked={wantTapPass}
            onCheckedChange={(checked) => setWantTapPass(checked as boolean)}
          />
          <Label htmlFor="tappass" className="text-sm">
            I want to join TapPass for rewards and faster checkout
          </Label>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to Payment'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>

      {wantTapPass && (
        <div className="mt-4 p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
          <h3 className="font-medium text-amber-500 mb-2">TapPass Benefits</h3>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>• Earn points on every order</li>
            <li>• Faster checkout process</li>
            <li>• Exclusive member rewards</li>
            <li>• Order history tracking</li>
          </ul>
          <Button
            onClick={handleTapPassSignup}
            className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
          >
            Sign up for TapPass
          </Button>
        </div>
      )}
    </div>
  );
} 