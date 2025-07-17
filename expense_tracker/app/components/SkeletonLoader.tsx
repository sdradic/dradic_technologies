import React from "react";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "bg-gray-200 dark:bg-gray-700",
  height = "h-4",
  width = "w-full",
  rounded = "rounded",
}) => {
  return (
    <div
      className={`animate-pulse ${height} ${width} ${rounded} ${className}`}
    />
  );
};

// Table skeleton
export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 h-[420px] overflow-x-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton height="h-6" width="w-32" className="mb-2" />
            <Skeleton height="h-4" width="w-48" />
          </div>
          <Skeleton height="h-10" width="w-32" rounded="rounded-lg" />
        </div>

        {/* Table */}
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="h-4" />
            ))}
          </div>

          {/* Data rows */}
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 dark:border-gray-800"
            >
              {Array.from({ length: 5 }).map((_, colIndex) => (
                <Skeleton key={colIndex} height="h-4" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Cards skeleton
export const CardsSkeleton: React.FC = () => {
  return (
    <>
      {/* Mobile: Carrousel skeleton */}
      <div className="sm:hidden">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 p-4"
            >
              <Skeleton height="h-4" width="w-24" className="mb-2" />
              <Skeleton height="h-6" width="w-32" className="mb-4" />
              <Skeleton height="h-8" width="w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid skeleton */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <Skeleton height="h-4" width="w-24" className="mb-2" />
            <Skeleton height="h-6" width="w-32" className="mb-4" />
            <Skeleton height="h-8" width="w-20" />
          </div>
        ))}
      </div>
    </>
  );
};

// Chart skeleton
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="mb-4">
        <Skeleton height="h-6" width="w-48" className="mb-2" />
        <Skeleton height="h-4" width="w-64" />{" "}
      </div>
      <div className="flex items-center justify-center h-64">
        <div className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <Skeleton height="h-8" width="w-16" />
        </div>
      </div>
    </div>
  );
};

// Charts and table layout skeleton
export const ChartsTableSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mt-4">
      <div className="w-full lg:w-1/2">
        <ChartSkeleton />
      </div>
      <div className="w-full lg:w-1/2">
        <TableSkeleton />
      </div>
    </div>
  );
};

export { Skeleton };
