import { MenuSkeleton } from '@/components/menu/MenuSkeleton';

export default function AdminMenuLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <MenuSkeleton />
        </div>

        <div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <MenuSkeleton />
        </div>
      </div>

      <div className="mt-12">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <MenuSkeleton />
      </div>

      <div className="mt-12">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        <MenuSkeleton />
      </div>
    </div>
  );
} 