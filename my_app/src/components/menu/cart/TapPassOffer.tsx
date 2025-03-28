'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TapPassOfferProps {
  orderTotal: number;
  onSkip: () => void;
}

export function TapPassOffer({ orderTotal, onSkip }: TapPassOfferProps) {
  const router = useRouter();
  const discount = orderTotal * 0.1; // 10% off

  return (
    <div className="p-4 space-y-4">
      <div className="bg-amber-600/10 border border-amber-600/20 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-amber-500 mb-2">Special Offer!</h2>
        <div className="space-y-2 text-gray-300">
          <p className="text-lg">Sign up for TapPass today and get:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-amber-500">✓</span>
              <span>10% off your order today (${discount.toFixed(2)})</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">✓</span>
              <span>Half off your first beer or mixed drink</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">✓</span>
              <span>Points on every order</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-amber-500">✓</span>
              <span>Faster checkout process</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => router.push('/tappass')}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          Sign up for TapPass
        </Button>
        <Button
          onClick={onSkip}
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:text-white"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
} 