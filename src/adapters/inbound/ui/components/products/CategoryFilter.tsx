import React from 'react';
import { ProductCategory, CATEGORY_LABELS } from '@/domain/entities/Product';

interface CategoryFilterProps {
  selectedCategory: ProductCategory | null;
  onSelectCategory: (category: ProductCategory | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({selectedCategory, onSelectCategory}) => {
  const categories = Object.values(ProductCategory);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${
            selectedCategory === null
              ? 'bg-gray-900 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          `}
        >
          Tous les produits
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`
              cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            `}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>
    </div>
  );
};
