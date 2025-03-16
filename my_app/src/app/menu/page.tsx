import { Suspense } from 'react';
import { getMenuItems } from '@/app/actions/menu-actions';
import MenuDisplay from '@/components/menu/MenuDisplay';
import { MenuSkeleton } from '@/components/menu/MenuSkeleton';
import type { MenuItem } from '@prisma/client';
import type { ApiResponse } from '@/app/actions/menu-actions';

// Force dynamic rendering to prevent stale data
export const dynamic = 'force-dynamic';
// Disable static page generation
export const generateStaticParams = false;
// Disable caching
export const revalidate = 0;

export default async function MenuPage() {
  try {
    // Add timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const menuResult: ApiResponse<MenuItem[]> = await getMenuItems();
    clearTimeout(timeoutId);
    
    if (!menuResult.success) {
      console.error('Menu fetch error:', menuResult.error);
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

    // Explicitly type the items array
    const items: MenuItem[] = menuResult.data;

    return (
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-10">Our Menu</h1>
        <Suspense fallback={<MenuSkeleton />}>
          <MenuDisplay items={items} />
        </Suspense>
      </div>
    );
  } catch (error) {
    // Log the error for debugging
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