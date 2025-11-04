/**
 * LoadingSkeleton - Beautiful skeleton loaders for better perceived performance
 */

export function SubjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
      </div>
      <div className="space-y-3 pt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function TocSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6 ml-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5 ml-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 ml-4"></div>
      </div>
    </div>
  );
}

export function FlashcardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
        <div className="space-y-4 w-full">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-12 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
