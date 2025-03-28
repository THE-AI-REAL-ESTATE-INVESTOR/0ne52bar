import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminMenuNotFound() {
  return (
    <div className="container mx-auto py-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
          Menu Not Found
        </h2>
        <p className="text-yellow-600 mb-4">
          The menu you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/admin/menu">Return to Menu Management</Link>
        </Button>
      </div>
    </div>
  );
} 