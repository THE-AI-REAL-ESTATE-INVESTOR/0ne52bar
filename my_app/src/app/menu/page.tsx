import { getActiveMenuItems } from '@/actions/menu/public';
import { MenuClient } from '@/components/menu/MenuClient';
import type { MenuItemWithCategory } from '@/types/menu';

// Force dynamic rendering to prevent stale data
export const dynamic = 'force-dynamic';
// Disable static page generation
export const generateStaticParams = false;
// Disable caching
export const revalidate = 0;

export default async function MenuPage() {
  console.log('Fetching menu items...');
  const result = await getActiveMenuItems();
  console.log('Menu items result:', result);

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Menu</h1>
        <p className="text-red-500">Error loading menu items: {result.error}</p>
      </div>
    );
  }

  // Filter out items without categories and cast to correct type
  const itemsWithCategories = result.data.filter(item => item.category) as MenuItemWithCategory[];
  console.log('Filtered items:', itemsWithCategories);

  return <MenuClient items={itemsWithCategories} />;
}