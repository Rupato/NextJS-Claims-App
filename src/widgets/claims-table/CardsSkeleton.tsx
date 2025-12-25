'use client';

import React from 'react';

export const CardsSkeleton = () => (
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(12)].map((_, i) => (
        <article
          key={i}
          className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse"
        >
          {/* Card Header Skeleton */}
          <header className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </header>

          {/* Card Content Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>

          {/* Card Footer Skeleton */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between space-y-2">
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
);
