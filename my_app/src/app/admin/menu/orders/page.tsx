import { OrderFeed } from '@/components/menu/adminMenu/ordering/OrderFeed';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const dynamic = 'force-dynamic';

export default function AdminOrdersPage() {
  return (
    <QueryProvider>
      <OrderFeed />
    </QueryProvider>
  );
}