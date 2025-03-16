import { Suspense } from 'react';
import { getMerchandise } from '@/app/actions/merchandise-actions';
import MerchList from '@/components/merch/MerchList';
import MerchSkeleton from '@/components/merch/MerchSkeleton';
import type { Merchandise, MerchandiseCategory } from '@prisma/client';

type MerchandiseWithCategory = Merchandise & {
  category: MerchandiseCategory;
};

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export default async function MerchPage() {
  const merchResult = await getMerchandise() as ApiResponse<MerchandiseWithCategory[]>;
  
  if (!merchResult.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 bg-red-900 bg-opacity-20 rounded-lg">
          <p className="text-red-400">{merchResult.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<MerchSkeleton />}>
        <MerchList initialItems={merchResult.data} />
      </Suspense>
    </div>
  );
}
