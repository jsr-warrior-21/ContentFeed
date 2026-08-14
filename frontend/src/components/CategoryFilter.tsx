'use client';

import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="border-b border-gray-200 mb-8 overflow-x-auto scrollbar-none">
      <div className="flex items-center space-x-6 text-sm font-medium">
        <button
          onClick={() => onSelectCategory('All')}
          className={`pb-3 transition-colors relative whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'text-gray-900 font-semibold border-b-2 border-black'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          For you
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`pb-3 transition-colors relative whitespace-nowrap ${
                isSelected
                  ? 'text-gray-900 font-semibold border-b-2 border-black'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
