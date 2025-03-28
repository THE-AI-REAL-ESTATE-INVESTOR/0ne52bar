import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCustomers } from '@/actions/customers';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface SearchParams {
  search?: string;
  phone?: string;
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Await the searchParams to fix the Next.js warning
  const search = await Promise.resolve(searchParams.search);
  const phone = await Promise.resolve(searchParams.phone);

  const customersResponse = await getCustomers({
    name: search,
    phone: phone
  });

  if (!customersResponse.success) {
    return (
      <div className="text-center text-gray-400 py-12">
        Failed to load customers
      </div>
    );
  }

  const { data: customers = [] } = customersResponse;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gray-900/50 border-gray-800">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input 
              type="search"
              placeholder="Search customers..."
              className="bg-gray-800 border-gray-700 text-gray-100"
              defaultValue={search}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-black text-gray-100 hover:text-amber-400 border-gray-700">
              Filter
            </Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-400">
              Add Customer
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-amber-500">Customer ID</TableHead>
              <TableHead className="text-amber-500">Name</TableHead>
              <TableHead className="text-amber-500">Phone</TableHead>
              <TableHead className="text-amber-500">Status</TableHead>
              <TableHead className="text-amber-500">Orders</TableHead>
              <TableHead className="text-amber-500">Last Visit</TableHead>
              <TableHead className="text-amber-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-gray-100">
                  {customer.type === 'member' ? customer.memberDetails?.memberId : customer.phoneNumber}
                </TableCell>
                <TableCell className="font-medium text-gray-100">
                  {customer.name}
                </TableCell>
                <TableCell className="text-gray-100">
                  {customer.phoneNumber}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={customer.type === 'member' ? 'default' : 'secondary'}
                    className={customer.type === 'member' ? 'bg-amber-500 text-black hover:bg-amber-600' : ''}
                  >
                    {customer.type === 'member' ? 'TapPass Member' : 'Guest'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-100">
                  {customer.orders.length} orders
                </TableCell>
                <TableCell className="text-gray-300">
                  {customer.memberDetails?.lastVisit 
                    ? formatDistanceToNow(new Date(customer.memberDetails.lastVisit), { addSuffix: true })
                    : customer.orders[0]?.createdAt 
                      ? formatDistanceToNow(new Date(customer.orders[0].createdAt), { addSuffix: true })
                      : 'Never'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" asChild className="bg-black text-gray-100 hover:text-amber-400 border-gray-700">
                    <Link href={`/admin/customers/${customer.id}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!customers || customers.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 