import { Suspense } from 'react';
import { getMenuItems } from '@/app/actions/menu-actions';
import MenuDisplay from '@/components/menu/MenuDisplay';
import { MenuSkeleton } from '@/components/menu/MenuSkeleton';
import type { MenuItem } from '@prisma/client';

type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MenuPage() {
  try {
    const menuResult = await getMenuItems() as ApiResponse<MenuItem[]>;
    
    if (!menuResult.success) {
      return (
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-4xl font-bold text-center mb-10">Our Menu</h1>
          <div className="text-center py-8 bg-red-900 bg-opacity-20 rounded-lg">
            <p className="text-red-400">Error loading menu: {menuResult.error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<MenuSkeleton />}>
          <MenuDisplay items={menuResult.data} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error in MenuPage:', error);
    return (
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-10">Our Menu</h1>
        <div className="text-center py-8 bg-red-900 bg-opacity-20 rounded-lg">
          <p className="text-red-400">Something went wrong. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}