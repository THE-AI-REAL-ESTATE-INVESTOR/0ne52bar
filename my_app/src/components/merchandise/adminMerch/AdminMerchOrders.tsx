'use client';

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

interface MerchOrder {
  id: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    size?: string;
    price: string;
  }[];
}

const columns: ColumnDef<MerchOrder>[] = [
  {
    accessorKey: 'id',
    header: 'Order ID',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => format(row.original.createdAt, 'MMM d, yyyy h:mm a'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === 'completed'
              ? 'success'
              : status === 'cancelled'
              ? 'destructive'
              : 'default'
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => {
      const items = row.original.items;
      return (
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.id} className="text-sm">
              {item.quantity}x {item.name}
              {item.size && ` (${item.size})`}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex gap-2">
          {status === 'pending' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleComplete(row.original.id)}
              >
                Complete
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleCancel(row.original.id)}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];

async function handleComplete(orderId: string) {
  // TODO: Implement order completion
  console.log('Complete order:', orderId);
}

async function handleCancel(orderId: string) {
  // TODO: Implement order cancellation
  console.log('Cancel order:', orderId);
}

export function AdminMerchOrders() {
  const [orders, setOrders] = React.useState<MerchOrder[]>([]);

  React.useEffect(() => {
    // TODO: Fetch orders from the API
    setOrders([
      {
        id: '1',
        createdAt: new Date(),
        status: 'pending',
        total: 54.99,
        items: [
          {
            id: '1',
            name: 'ONE-52 Hoodie',
            quantity: 1,
            size: 'L',
            price: '54.99',
          },
        ],
      },
    ]);
  }, []);

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={orders} />
    </div>
  );
} 