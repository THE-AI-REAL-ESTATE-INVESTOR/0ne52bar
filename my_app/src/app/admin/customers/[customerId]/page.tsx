import { getCustomer } from '@/actions/customers';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CustomerDetailsPageProps {
  params: {
    customerId: string;
  };
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const customerResponse = await getCustomer(params.customerId);

  if (!customerResponse.success) {
    notFound();
  }

  const { customer } = customerResponse;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">
            {customer.name}
          </h1>
          <p className="text-gray-400">
            {customer.phoneNumber}
          </p>
        </div>
        <Badge variant={customer.memberId ? 'default' : 'secondary'}>
          {customer.memberId ? 'Member' : 'Guest'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Customer Information</h2>
          <div className="space-y-4">
            {customer.memberId && (
              <>
                <div>
                  <p className="text-gray-400">Member Since</p>
                  <p className="font-medium">
                    {format(new Date(customer.joinDate), 'PPP')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Points Balance</p>
                  <p className="font-medium">{customer.points} points</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Visits</p>
                  <p className="font-medium">{customer.visits} visits</p>
                </div>
              </>
            )}
            <div>
              <p className="text-gray-400">Last Visit</p>
              <p className="font-medium">
                {customer.lastVisit
                  ? formatDistanceToNow(new Date(customer.lastVisit), { addSuffix: true })
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6 bg-gray-900/50 border-gray-800">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {customer.orders.map((order) => (
              <div 
                key={order.id} 
                className="flex justify-between items-start border-b border-gray-800 pb-4 last:border-0"
              >
                <div>
                  <Link 
                    href={`/admin/menu/orders/${order.id}`}
                    className="font-medium text-amber-500 hover:text-amber-400"
                  >
                    Order #{order.id.slice(0, 8)}
                  </Link>
                  <p className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">${order.total.toFixed(2)}</p>
                  <Badge 
                    variant={
                      order.status === 'PENDING' ? 'default' :
                      order.status === 'PREPARING' ? 'secondary' :
                      order.status === 'READY' ? 'success' :
                      'destructive'
                    }
                    className="mt-1"
                  >
                    {order.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
            {customer.orders.length === 0 && (
              <p className="text-center text-gray-400 py-8">
                No orders found
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/admin/customers">
            Back to Customers
          </Link>
        </Button>
        {!customer.memberId && (
          <Button>
            Convert to Member
          </Button>
        )}
      </div>
    </div>
  );
} 