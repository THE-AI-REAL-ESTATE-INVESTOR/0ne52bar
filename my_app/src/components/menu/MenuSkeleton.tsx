export function MenuSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="h-10 w-64 bg-gray-800 rounded mx-auto mb-10 animate-pulse"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="h-0.5 w-6 bg-gray-700 mr-2"></div>
              <div className="h-8 w-48 bg-gray-700 rounded"></div>
              <div className="h-0.5 w-6 bg-gray-700 ml-2"></div>
            </div>
            
            <div className="space-y-3">
              {[...Array(6)].map((_, j) => (
                <div key={j}>
                  <div className="flex justify-between mb-2">
                    <div className="h-6 w-32 bg-gray-700 rounded"></div>
                    <div className="h-6 w-16 bg-gray-700 rounded"></div>
                  </div>
                  {Math.random() > 0.5 && (
                    <div className="h-4 w-48 bg-gray-700 rounded"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 