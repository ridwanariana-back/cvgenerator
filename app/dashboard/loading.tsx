export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 space-y-10">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Skeleton */}
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-full bg-gray-100 rounded-xl"></div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6 animate-pulse">
          <div className="h-[400px] w-full bg-gray-50 rounded-[2.5rem] border border-gray-100"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 rounded-full"></div>
            <div className="h-4 w-5/6 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}