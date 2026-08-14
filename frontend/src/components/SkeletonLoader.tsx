'use client';

import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border-b border-gray-100 pb-8 flex items-start justify-between gap-6 animate-pulse">
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-gray-200" />
              <div className="w-24 h-3 bg-gray-200 rounded" />
            </div>
            <div className="w-3/4 h-5 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-100 rounded" />
            <div className="w-2/3 h-4 bg-gray-100 rounded" />
            <div className="w-20 h-3 bg-gray-200 rounded pt-2" />
          </div>

          <div className="w-28 sm:w-40 h-20 sm:h-28 rounded-lg bg-gray-200 shrink-0" />
        </div>
      ))}
    </div>
  );
};
