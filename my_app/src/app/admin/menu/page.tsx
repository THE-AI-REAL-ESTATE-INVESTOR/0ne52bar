import { getMenuItems, getCategories } from '@/actions/menu/admin';
import { MenuAdmin } from '../../../components/menu/MenuAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage() {
  const [menuItemsResponse, categoriesResponse] = await Promise.all([
    getMenuItems(),
    getCategories()
  ]);

  if (!menuItemsResponse.success || !categoriesResponse.success) {
    throw new Error('Failed to load menu data');
  }

  return <MenuAdmin 
    initialMenuItems={menuItemsResponse.data} 
    initialCategories={categoriesResponse.data} 
  />;
} 