"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

export default function OrderButton() {
  const handleClick = () => {
    // Dispatch a custom event that MenuOrderSystem listens for
    const event = new CustomEvent('open-menu-order');
    document.dispatchEvent(event);
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-full shadow-lg"
    >
      Order Now
    </Button>
  );
} 