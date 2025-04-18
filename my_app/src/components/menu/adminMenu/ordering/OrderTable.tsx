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
import Link from 'next/link';
import type { Order } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderWithCustomer extends Order {
  memberId?: string;
  guestInfo?: {
    name: string;
    phone: string;
    guestId: string;
  } | null;
}

interface OrderTableProps {
  initialOrders: OrderWithCustomer[];
  isLoading: boolean;
}

export function OrderTable({ initialOrders, isLoading }: OrderTableProps) {
  const [orders] = useState<OrderWithCustomer[]>(initialOrders);

  const getCustomerInfo = (order: OrderWithCustomer) => {
    if (order.memberId) {
      return {
        id: order.memberId,
        type: 'member',
        link: `/admin/customers/${order.memberId}`
      };
    }
    if (order.guestInfo) {
      return {
        id: order.guestInfo.guestId,
        type: 'guest',
        link: `/admin/customers/guest/${order.guestInfo.guestId}`
      };
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24" />
        </div>
        <Card className="bg-gray-900/50 border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-amber-500">Order ID</TableHead>
                <TableHead className="text-amber-500">Customer</TableHead>
                <TableHead className="text-amber-500">Status</TableHead>
                <TableHead className="text-amber-500">Items</TableHead>
                <TableHead className="text-amber-500">Total</TableHead>
                <TableHead className="text-amber-500">Time</TableHead>
                <TableHead className="text-amber-500 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-amber-500">All Orders</h2>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-amber-500">Order ID</TableHead>
              <TableHead className="text-amber-500">Customer</TableHead>
              <TableHead className="text-amber-500">Status</TableHead>
              <TableHead className="text-amber-500">Items</TableHead>
              <TableHead className="text-amber-500">Total</TableHead>
              <TableHead className="text-amber-500">Time</TableHead>
              <TableHead className="text-amber-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const customerInfo = getCustomerInfo(order);
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-gray-400">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    {customerInfo ? (
                      <div className="flex items-center gap-2">
                        <Badge variant={customerInfo.type === 'member' ? 'default' : 'secondary'}>
                          {customerInfo.type}
                        </Badge>
                        <Link 
                          href={customerInfo.link}
                          className="text-amber-500 hover:text-amber-400 underline"
                        >
                          {customerInfo.id.slice(0, 8)}
                        </Link>
                      </div>
                    ) : (
                      <span className="text-gray-400">Anonymous</span>
                    )}
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
                    {Array.isArray(order.items) ? order.items.length : 0} items
                  </TableCell>
                  <TableCell className="text-gray-400">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/admin/menu/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 