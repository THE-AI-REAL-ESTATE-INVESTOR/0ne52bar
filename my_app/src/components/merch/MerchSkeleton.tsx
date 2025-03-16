export default function MerchSkeleton() {
  return (
    <div className="py-8">
      {/* Title Skeleton */}
      <div className="h-10 w-64 bg-gray-800 rounded-lg mx-auto mb-12 animate-pulse"></div>
      
      {/* Coming Soon Banner Skeleton */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
        <div className="h-6 w-full bg-gray-700 rounded"></div>
      </div>
      
      {/* Grid of Item Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-900 rounded-lg overflow-hidden shadow-md">
            {/* Image Skeleton */}
            <div className="h-64 w-full bg-gray-800 animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="p-4">
              <div className="h-6 w-3/4 bg-gray-800 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-full bg-gray-800 rounded mb-3 animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 w-20 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 