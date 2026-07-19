import React, { useState } from 'react';

const CATEGORIES = [
  'Todos',
  'Desarrollo Web',
  'Diseño UI/UX',
  'Data Science',
  'Marketing Digital'
];

export const CourseFilters = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-row overflow-x-auto scrollbar-hide gap-4 mb-8 pb-2">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none ${
              isActive
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CourseFilters;
