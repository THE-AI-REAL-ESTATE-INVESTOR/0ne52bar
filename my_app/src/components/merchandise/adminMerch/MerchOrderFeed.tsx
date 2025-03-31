'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MerchOrderTable } from './MerchOrderTable';
import { MerchOrderFeedView } from './MerchOrderFeedView';
import { useQuery } from '@tanstack/react-query';
import { getMerchOrders, getActiveMerchOrders } from '@/actions/merchOrderActions';

export function MerchOrderFeed() {
  const [activeTab, setActiveTab] = useState('feed');

  // Fetch orders for both views
  const { data: activeOrdersResponse } = useQuery({
    queryKey: ['activeMerchOrders'],
    queryFn: getActiveMerchOrders,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const { data: allOrdersResponse } = useQuery({
    queryKey: ['allMerchOrders'],
    queryFn: getMerchOrders,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-500">Merchandise Orders</h1>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed" className="text-amber-500 data-[state=active]:bg-amber-500/20">
              Active Orders
            </TabsTrigger>
            <TabsTrigger value="table" className="text-amber-500 data-[state=active]:bg-amber-500/20">
              All Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4">
            <MerchOrderFeedView 
              orders={activeOrdersResponse?.data || []} 
              isLoading={!activeOrdersResponse}
            />
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <MerchOrderTable 
              initialOrders={allOrdersResponse?.data || []} 
              isLoading={!allOrdersResponse}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 