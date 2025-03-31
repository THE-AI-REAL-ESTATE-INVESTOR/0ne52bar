'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMerchCart } from '@/contexts/MerchCartContext';
import { CheckCircle } from 'lucide-react';

interface MerchOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MerchOrderModal({ isOpen, onClose }: MerchOrderModalProps) {
  const { clearCart, total } = useMerchCart();

  const handleConfirm = () => {
    clearCart();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order Confirmation</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h3 className="text-xl font-bold text-center">
            Thank you for your order!
          </h3>
          <p className="text-center text-gray-600">
            Total: ${total.toFixed(2)}
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-center text-blue-800 font-medium">
              Please pick up and pay for your merchandise at the bar.
            </p>
            <p className="text-center text-blue-600 text-sm mt-2">
              Online payment coming soon!
            </p>
          </div>
          <Button onClick={handleConfirm} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 