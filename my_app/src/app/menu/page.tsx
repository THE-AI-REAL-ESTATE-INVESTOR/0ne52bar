import { getActiveMenuItems } from '@/actions/menu/public';
import { MenuClient } from '@/components/menu/MenuClient';
import type { MenuItemWithCategory } from '@/types/menu';

// Use static rendering with revalidation every hour
export const revalidate = 3600;

export default async function MenuPage() {
  const result = await getActiveMenuItems();

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

  return <MenuClient items={itemsWithCategories} />;
}