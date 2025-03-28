'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { OrderStatus } from '@prisma/client';
import { updateOrderStatus } from '@/actions/orders';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  memberId?: string;
  customerName: string;
  phoneNumber: string;
}

interface OrderFeedViewProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderFeedView({ orders, isLoading }: OrderFeedViewProps) {
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const response = await updateOrderStatus(orderId, newStatus);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
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
          className={`p-4 space-y-4 ${
            editingOrder === order.id ? 'ring-2 ring-amber-500' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-amber-500">
                Order #{order.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-400">
                {order.customerName} • {order.phoneNumber}
              </p>
            </div>
            <Badge 
              variant={
                order.status === 'PENDING' ? 'default' :
                order.status === 'PREPARING' ? 'secondary' :
                order.status === 'READY' ? 'success' :
                'destructive'
              }
            >
              {order.status.toLowerCase()}
            </Badge>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-400 ml-2">x{item.quantity}</span>
                </div>
                <span className="text-gray-400">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-800">
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
            </span>
            <div className="flex items-center gap-2">
              {order.status === 'PENDING' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                >
                  Start Preparing
                </Button>
              )}
              {order.status === 'PREPARING' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'READY')}
                >
                  Mark Ready
                </Button>
              )}
              {order.status === 'READY' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                >
                  Complete
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingOrder(
                  editingOrder === order.id ? null : order.id
                )}
              >
                {editingOrder === order.id ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 