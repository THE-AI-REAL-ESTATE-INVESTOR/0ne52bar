export function EventsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col bg-gray-900 rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-800" />
          <div className="p-4">
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-2/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
} 