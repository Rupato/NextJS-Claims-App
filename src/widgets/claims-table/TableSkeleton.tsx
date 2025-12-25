'use client';

import React from 'react';

export const TableSkeleton = () => (
  <div className="flex flex-col h-full">
    {/* Skeleton table header */}
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="grid grid-cols-9 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded animate-pulse"></div>
        ))}
      </div>
    </div>

    {/* Skeleton table rows */}
    <div className="flex-1 p-6">
      <div className="space-y-3">
        {[...Array(15)].map((_, i) => (
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
);
