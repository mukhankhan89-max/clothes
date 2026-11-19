import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CLOTHING_CATEGORIES, HIGHLIGHT_FILTERS } from '../data/products';
import type { ClothingCategory, CollectionHighlight, Product } from '../types/shop';
import { ProductCard } from './ProductCard';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount';

interface CatalogSectionProps {
  products: Product[];
  selectedHighlight: CollectionHighlight;
  selectedCategory: ClothingCategory | 'All';
  searchQuery: string;
  sortBy: SortOption;
  onSelectHighlight: (highlight: CollectionHighlight) => void;
  onSelectCategory: (category: ClothingCategory | 'All') => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function CatalogSection({
  products,
  selectedHighlight,
  selectedCategory,
  searchQuery,
  sortBy,
  onSelectHighlight,
  onSelectCategory,
  onSearchChange,
  onSortChange,
  onResetFilters,
  onSelectProduct,
  onQuickAdd,
}: CatalogSectionProps) {
  const hasActiveFilters =
    selectedHighlight !== 'All Pieces' ||
    selectedCategory !== 'All' ||
    searchQuery.trim() !== '';

  return (
    <section id="collections" className="py-10 sm:py-14 lg:py-16 bg-[#FCFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Controls Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E7DDD2]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#7A5C30]">
              Curated Wardrobe
            </p>
            <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl font-semibold text-[#1F1A17]">
              The Ready-to-Wear &amp; Couture Collection
            </h2>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="w-4 h-4 text-[#61554D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search dresses, abayas, silk..."
                aria-label="Search clothing collection"
                className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-lg bg-[#F5EFE8] border border-[#E7DDD2] text-sm text-[#1F1A17] placeholder:text-[#61554D] focus:outline-none focus:border-[#9A7845] focus:bg-[#FCFBF9] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-[#61554D] hover:text-[#1F1A17]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <SlidersHorizontal
                className="w-4 h-4 text-[#61554D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.75}
              />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                aria-label="Sort products"
                className="w-full sm:w-auto min-h-[44px] pl-10 pr-8 py-2 rounded-lg bg-[#F5EFE8] border border-[#E7DDD2] text-sm font-medium text-[#1F1A17] focus:outline-none focus:border-[#9A7845] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Special Offers First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Highlight Tabs (New Arrivals, Best Sellers, Trending, Seasonal, On Sale) */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Collection highlights">
          {HIGHLIGHT_FILTERS.map((highlight) => {
            const active = selectedHighlight === highlight;
            return (
              <button
                key={highlight}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectHighlight(highlight)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7845] ${
                  active
                    ? 'bg-[#1F1A17] text-[#FCFBF9]'
                    : 'bg-[#F5EFE8] text-[#594E47] hover:bg-[#EDE3D8] hover:text-[#1F1A17]'
                }`}
              >
                {highlight}
              </button>
            );
          })}
        </div>

        {/* 16-Category Horizontal Filter Bar */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2" aria-label="Clothing categories">
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'border-[#9A7845] bg-[#F5EFE8] text-[#1F1A17]'
                : 'border-[#E7DDD2] bg-[#FCFBF9] text-[#594E47] hover:border-[#CBB9A4] hover:text-[#1F1A17]'
            }`}
          >
            All Categories
          </button>
          {CLOTHING_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#9A7845] bg-[#F5EFE8] text-[#1F1A17]'
                    : 'border-[#E7DDD2] bg-[#FCFBF9] text-[#594E47] hover:border-[#CBB9A4] hover:text-[#1F1A17]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Active Count & Reset Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#61554D]">
          <p className="tabular-nums">
            Showing <span className="font-semibold text-[#1F1A17]">{products.length}</span>{' '}
            {products.length === 1 ? 'piece' : 'pieces'}
            {selectedCategory !== 'All' && (
              <>
                {' '}
                in <span className="font-medium text-[#1F1A17]">{selectedCategory}</span>
              </>
            )}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="min-h-[36px] px-2 text-xs font-medium text-[#7A5C30] hover:text-[#1F1A17] underline underline-offset-4"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-7">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#E7DDD2] bg-[#F5EFE8] py-14 px-6 text-center">
            <p className="font-serif text-2xl font-medium text-[#1F1A17]">
              No matching garments found
            </p>
            <p className="mt-2 text-sm text-[#594E47] max-w-md mx-auto">
              Try clearing your search term or switching back to all categories to view our full couture and ready-to-wear collection.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 min-h-[44px] px-6 py-2.5 rounded-lg bg-[#1F1A17] text-[#FCFBF9] hover:bg-[#382F29] text-sm font-medium transition-colors"
            >
              Show All Collection Pieces
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
