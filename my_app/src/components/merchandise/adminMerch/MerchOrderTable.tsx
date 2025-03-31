'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface MerchOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  size?: string;
}

interface MerchOrder {
  id: string;
  createdAt: Date;
  status: string;
  isPaid: boolean;
  isPickedUp: boolean;
  total: number;
  items: MerchOrderItem[];
  customerName?: string;
  phoneNumber?: string;
  memberId?: string;
}

interface MerchOrderTableProps {
  initialOrders: MerchOrder[];
  isLoading: boolean;
}

export function MerchOrderTable({ initialOrders, isLoading }: MerchOrderTableProps) {
  const [orders] = useState<MerchOrder[]>(initialOrders);

  const getCustomerInfo = (order: MerchOrder) => {
    if (order.memberId) {
      return {
        id: order.memberId,
        type: 'member',
        link: `/admin/customers/${order.memberId}`
      };
    }
    if (order.customerName) {
      return {
        id: order.customerName,
        type: 'guest',
        name: order.customerName,
        phone: order.phoneNumber
      };
    }
    return null;
  };

  const getOrderStatus = (order: MerchOrder) => {
    if (order.status === 'cancelled') return { label: 'Cancelled', variant: 'destructive' as const };
    if (order.isPickedUp) return { label: 'Picked Up', variant: 'success' as const };
    if (order.isPaid) return { label: 'Paid', variant: 'secondary' as const };
    return { label: 'Pending', variant: 'default' as const };
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
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
              const status = getOrderStatus(order);
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
                        {customerInfo.type === 'member' ? (
                          <Link 
                            href={customerInfo.link}
                            className="text-amber-500 hover:text-amber-400 underline"
                          >
                            {customerInfo.id.slice(0, 8)}
                          </Link>
                        ) : (
                          <div className="text-gray-300">
                            <div>{customerInfo.name}</div>
                            {customerInfo.phone && (
                              <div className="text-sm text-gray-400">{customerInfo.phone}</div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>
                      {status.label}
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
                      <Link href={`/admin/merchandise/orders/${order.id}`}>
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