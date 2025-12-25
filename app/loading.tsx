export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Claims Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View and manage all insurance claims
            </p>
          </div>
          <div className="flex flex-col h-full min-h-[600px]">
            {/* Skeleton table header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex-shrink-0">
              <div className="grid grid-cols-9 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-300 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* Skeleton table rows - fill all available space */}
            <div className="flex-1 min-h-0">
              <div className="h-full p-6 overflow-hidden">
                <div className="space-y-3 h-full">
                  {/* Fill the entire height with skeleton rows */}
                  <div
                    className="grid gap-3"
                    style={{ gridTemplateRows: 'repeat(auto-fill, 1fr)' }}
                  >
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className="border-b border-gray-100 pb-3">
                        <div className="grid grid-cols-9 gap-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
