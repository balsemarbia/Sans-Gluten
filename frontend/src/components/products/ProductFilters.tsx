import { useState, useEffect } from 'react';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  sortBy: 'name' | 'price' | 'newest' | 'popular';
  searchQuery: string;
}

export default function ProductFilters({ onFilterChange, categories }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 100],
    inStock: false,
    sortBy: 'newest',
    searchQuery: ''
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category: prev.category === category ? '' : category }));
  };

  const handlePriceChange = (index: number, value: number) => {
    setFilters(prev => {
      const newRange = [...prev.priceRange] as [number, number];
      newRange[index] = value;
      return { ...prev, priceRange: newRange };
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 100],
      inStock: false,
      sortBy: 'newest',
      searchQuery: ''
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.inStock,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 100
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary-500 text-white p-4 rounded-full shadow-lg"
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>

      {/* Filters Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white shadow-xl lg:shadow-md z-50 transition-transform duration-300 overflow-y-auto`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary-600" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Effacer
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  !filters.category ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                Tous les produits
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filters.category === category ? 'bg-primary-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Prix (DT)</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Max"
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="font-medium text-gray-900">En stock uniquement</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Trier par</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Plus récents</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
              <option value="popular">Populaires</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
