import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

const AdvancedFilters = ({ filters, onFilterChange, categories = [], brands = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    minPrice: filters?.minPrice || '',
    maxPrice: filters?.maxPrice || '',
    categories: Array.isArray(filters?.categories) ? filters.categories : [],
    brands: Array.isArray(filters?.brands) ? filters.brands : [],
    inStock: filters?.inStock || false,
    onSale: filters?.onSale || false,
    rating: filters?.rating || 0,
  });

  // Sync localFilters when filters prop changes
  useEffect(() => {
    if (filters) {
      setLocalFilters({
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || '',
        categories: Array.isArray(filters.categories) ? filters.categories : [],
        brands: Array.isArray(filters.brands) ? filters.brands : [],
        inStock: filters.inStock || false,
        onSale: filters.onSale || false,
        rating: filters.rating || 0,
      });
    }
  }, [filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: '',
      maxPrice: '',
      categories: [],
      brands: [],
      inStock: false,
      onSale: false,
      rating: 0,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsOpen(false);
  };

  const toggleCategory = (categoryId) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: (prev.categories || []).includes(categoryId)
        ? (prev.categories || []).filter(id => id !== categoryId)
        : [...(prev.categories || []), categoryId],
    }));
  };

  const toggleBrand = (brand) => {
    setLocalFilters(prev => ({
      ...prev,
      brands: (prev.brands || []).includes(brand)
        ? (prev.brands || []).filter(b => b !== brand)
        : [...(prev.brands || []), brand],
    }));
  };

  const activeFilterCount = [
    localFilters.minPrice || localFilters.maxPrice,
    (localFilters.categories || []).length > 0,
    (localFilters.brands || []).length > 0,
    localFilters.inStock,
    localFilters.onSale,
    localFilters.rating > 0,
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={localFilters.minPrice}
                      onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={localFilters.maxPrice}
                      onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                      placeholder="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label
                        key={category._id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(localFilters.categories || []).includes(category._id)}
                          onChange={() => toggleCategory(category._id)}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(localFilters.brands || []).includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={localFilters.rating === rating}
                        onChange={() => setLocalFilters({ ...localFilters, rating })}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">
                        {rating} stars & above
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Filters */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Other</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.inStock}
                      onChange={(e) => setLocalFilters({ ...localFilters, inStock: e.target.checked })}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.onSale}
                      onChange={(e) => setLocalFilters({ ...localFilters, onSale: e.target.checked })}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">On Sale</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default AdvancedFilters;

