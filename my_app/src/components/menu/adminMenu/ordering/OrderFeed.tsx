'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  items: string; // JSON string of OrderItem[]
  total: number;
  createdAt: Date;
  updatedAt: Date;
  memberId?: string;
  guestInfo?: string; // JSON string of guest info
}

interface OrderFeedProps {
  initialOrders: Order[];
}

export function OrderFeed({ initialOrders }: OrderFeedProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    // Status update logic will go here
    setOrders(currentOrders => 
      currentOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-500">Order Feed</h1>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-amber-500">Order ID</TableHead>
              <TableHead className="text-amber-500">Status</TableHead>
              <TableHead className="text-amber-500">Items</TableHead>
              <TableHead className="text-amber-500">Total</TableHead>
              <TableHead className="text-amber-500">Time</TableHead>
              <TableHead className="text-amber-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-gray-400">
                  {order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-gray-400">
                  {JSON.parse(order.items).length} items
                </TableCell>
                <TableCell className="text-gray-400">
                  ${order.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-gray-400">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 