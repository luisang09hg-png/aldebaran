import React from 'react';

const CATEGORIES = [
  'Todos',
  'Desarrollo Web',
  'Diseño UI/UX',
  'Data Science',
  'Marketing Digital'
];

export const CourseFilters = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="skills-center-filters">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`skills-center-filter-button ${isActive ? 'active' : ''}`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CourseFilters;
