'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationInfo } from '@/types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, totalPages, hasNextPage, hasPrevPage, totalItems } = pagination;

  return (
    <div className="flex items-center justify-between py-8 border-t border-gray-200 text-xs text-gray-500 font-medium">
      <div>
        Showing page <span className="font-semibold text-gray-900">{page}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalPages}</span> ({totalItems} stories)
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors disabled:hover:bg-white"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors disabled:hover:bg-white"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
