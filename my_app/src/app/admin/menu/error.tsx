'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function AdminMenuError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Menu management error:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-red-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-red-600 mb-4">
          {error.message || 'An error occurred while loading the menu management page.'}
        </p>
        <Button
          onClick={reset}
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          Try again
        </Button>
      </div>
    </div>
  );
} 