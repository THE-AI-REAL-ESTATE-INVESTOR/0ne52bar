import { getOrders } from '@/actions/orders/admin';
import { OrderTable } from '@/components/menu/adminMenu/ordering/OrderTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const ordersResponse = await getOrders();

  if (!ordersResponse.success) {
    throw new Error('Failed to load orders');
  }

  return <OrderTable initialOrders={ordersResponse.data} />;
}