import { getCategories, getMerchandise } from '@/actions/merchandiseActions';
import { MerchandiseList } from '@/components/merchandise/MerchandiseList';

export default async function MerchandisePage() {
  // Get all merchandise items and categories
  const [merchandiseResponse, categoriesResponse] = await Promise.all([
    getMerchandise(),
    getCategories()
  ]);

  // Handle error cases
  if (!merchandiseResponse.success || !categoriesResponse.success) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Merchandise</h1>
          <p className="text-gray-400 text-center">Unable to load merchandise at this time.</p>
        </div>
      </main>
    );
  }

  const items = merchandiseResponse.items || [];
  const categories = categoriesResponse.categories || [];

  // Group items by category
  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = items.filter(item => item.categoryId === category.id);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Merchandise</h1>
        
        {/* Display items by category */}
        {categories.map(category => {
          const categoryItems = itemsByCategory[category.id] || [];
          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} className="mb-16">
              <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
              <MerchandiseList items={categoryItems} />
            </section>
          );
        })}

        {/* No Items Message */}
        {items.length === 0 && (
          <div className="text-center p-8 bg-gray-900 rounded-lg">
            <p className="text-xl">No merchandise available at this time.</p>
            <p className="mt-2 text-gray-400">Check back soon for new items!</p>
          </div>
        )}
      </div>
    </main>
  );
}
