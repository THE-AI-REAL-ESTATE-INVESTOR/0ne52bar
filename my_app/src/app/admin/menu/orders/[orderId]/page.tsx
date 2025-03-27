import { getOrder } from '@/actions/orders';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const orderResponse = await getOrder(params.orderId);

  if (!orderResponse.success) {
    notFound();
  }

  const order = orderResponse.data;
  const items: OrderItem[] = typeof order.items === 'string' 
    ? JSON.parse(order.items) 
    : Array.isArray(order.items) 
      ? order.items 
      : [];

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = order.total || subtotal;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-400">
            Placed {format(new Date(order.createdAt), 'PPp')}
            {' '}({formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })})
          </p>
        </div>
        <Badge 
          variant={
            order.status === 'PENDING' ? 'default' :
            order.status === 'PREPARING' ? 'secondary' :
            order.status === 'READY' ? 'secondary' :
            'destructive'
          }
          className="text-lg py-1 px-4"
        >
          {order.status.toLowerCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Order Items</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-start border-b border-gray-700 pb-4 last:border-0">
                <div>
                  <h3 className="font-medium text-gray-100">{item.name}</h3>
                  {item.notes && (
                    <p className="text-sm text-gray-300 mt-1">Note: {item.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-amber-400">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-gray-700 pt-4">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span className="text-gray-100">Total</span>
              <span className="text-amber-400">${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Customer Details */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300">Name</p>
              <p className="font-medium text-gray-100">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-300">Phone</p>
              <p className="font-medium text-gray-100">{order.phoneNumber}</p>
            </div>
            {order.memberId && (
              <div>
                <p className="text-gray-300">Member ID</p>
                <Link 
                  href={`/admin/customers/${order.memberId}`}
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  {order.memberId}
                </Link>
              </div>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700">
            <Button asChild variant="outline" className="w-full bg-black text-gray-100 hover:text-amber-400 border-gray-700">
              <Link href={order.memberId ? `/admin/customers/${order.memberId}` : `/admin/customers?phone=${order.phoneNumber}`}>
                View Customer History
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" asChild className="bg-black text-gray-100 hover:text-amber-400 border-gray-700">
          <Link href="/admin/menu/orders">
            Back to Orders
          </Link>
        </Button>
      </div>
    </div>
  );
} 