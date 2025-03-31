'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { updateMerchOrderStatus } from '@/actions/merchOrderActions';

interface MerchOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  size?: string;
}

interface MerchOrder {
  id: string;
  status: string;
  isPaid: boolean;
  isPickedUp: boolean;
  items: MerchOrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  customerName?: string;
  phoneNumber?: string;
}

interface MerchOrderFeedViewProps {
  orders: MerchOrder[];
  isLoading: boolean;
}

export function MerchOrderFeedView({ orders, isLoading }: MerchOrderFeedViewProps) {
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, updates: { isPaid?: boolean; isPickedUp?: boolean }) => {
    const response = await updateMerchOrderStatus(orderId, updates);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ['activeMerchOrders'] });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <Card 
          key={order.id} 
          className={`p-4 space-y-4 bg-gray-900/50 border-gray-800 ${
            editingOrder === order.id ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-amber-500">
                Order #{order.id.slice(0, 8)}
              </h3>
              {order.customerName && (
                <p className="text-sm text-gray-400">
                  {order.customerName} {order.phoneNumber && `• ${order.phoneNumber}`}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {!order.isPaid && (
                <Badge variant="default">Pending Payment</Badge>
              )}
              {order.isPaid && !order.isPickedUp && (
                <Badge variant="secondary">Paid</Badge>
              )}
              {order.isPickedUp && (
                <Badge variant="success">Picked Up</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-200">{item.name}</span>
                  {item.size && (
                    <span className="text-gray-400 ml-2">({item.size})</span>
                  )}
                  <span className="text-gray-400 ml-2">x{item.quantity}</span>
                </div>
                <span className="text-gray-300">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Total:</span>
              <span className="text-lg font-bold text-amber-500">${order.total.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-2">
              {!order.isPaid && (
                <Button
                  variant="outline"
                  className="w-full bg-gray-800 hover:bg-gray-700"
                  onClick={() => handleStatusUpdate(order.id, { isPaid: true })}
                >
                  Mark as Paid
                </Button>
              )}
              {order.isPaid && !order.isPickedUp && (
                <Button
                  variant="outline"
                  className="w-full bg-gray-800 hover:bg-gray-700"
                  onClick={() => handleStatusUpdate(order.id, { isPickedUp: true })}
                >
                  Mark as Picked Up
                </Button>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-400 text-right">
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
          </div>
        </Card>
      ))}
    </div>
  );
} 