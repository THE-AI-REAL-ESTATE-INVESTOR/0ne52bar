import { Suspense } from 'react';
import { getMenuItems } from '@/app/actions/menu-actions';
import MenuDisplay from '@/components/menu/MenuDisplay';
import { MenuSkeleton } from '@/components/menu/MenuSkeleton';
import type { MenuItem } from '@prisma/client';
import type { ApiResponse } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const menuResult = await getMenuItems() as ApiResponse<MenuItem[]>;
  
  if (!menuResult.success) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-10">Our Menu</h1>
        <div className="text-red-500 text-center">
          Error loading menu: {menuResult.error?.message}
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuDisplay items={menuResult.data} />
    </Suspense>
  );
}