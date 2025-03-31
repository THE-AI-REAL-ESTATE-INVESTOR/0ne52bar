'use client';

import { QueryProvider } from '@/components/providers/QueryProvider';
import { MerchOrderFeed } from '@/components/merchandise/adminMerch/MerchOrderFeed';

export default function AdminMerchOrdersPage() {
  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <div className="container mx-auto py-8">
        <div className="bg-gray-900/50 rounded-lg shadow-sm border border-gray-800 p-6">
          <QueryProvider>
            <MerchOrderFeed />
          </QueryProvider>
        </div>
      </div>
    </div>
  );
} 