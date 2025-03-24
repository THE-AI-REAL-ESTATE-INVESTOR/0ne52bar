import { getMenuItems } from '@/actions/menu-actions';
import MenuDisplay from '@/components/menu/MenuDisplay';

// Force dynamic rendering to prevent stale data
export const dynamic = 'force-dynamic';
// Disable static page generation
export const generateStaticParams = false;
// Disable caching
export const revalidate = 0;

export default async function MenuPage() {
  const result = await getMenuItems();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Menu</h1>
        <p className="text-red-500">Error loading menu items: {result.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      <MenuDisplay items={result.data || []} />
    </div>
  );
}