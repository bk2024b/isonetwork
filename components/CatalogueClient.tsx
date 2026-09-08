'use client';

import { useState, useCallback } from 'react';
import { Product, FilterState, SortOption } from '@/types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';

interface CatalogueClientProps {
  products: Product[];
  initialSearch?: string;
  initialCategory?: string;
}

const CATEGORIES = [
  'Ordinateurs portables',
  'Ordinateurs de bureau',
  'Accessoires',
  'Matériel bureautique',
];

const CONDITIONS = ['Neuf', 'Occasion A+', 'Reconditionné'];
const STOCK_OPTIONS = ['En stock', 'Stock limité', 'Rupture de stock'];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Plus récents', value: 'newest' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
  { label: 'Nom A→Z', value: 'name-asc' },
];

export default function CatalogueClient({
  products,
  initialSearch = '',
  initialCategory = '',
}: CatalogueClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    brand: '',
    condition: '',
    minPrice: 0,
    maxPrice: 1000000,
    stockStatus: '',
    sort: 'newest',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [gridView, setGridView] = useState(true);

  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  const filtered = products
    .filter((p) => {
      const q = filters.search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) {
        return false;
      }
      if (filters.category && p.category !== filters.category) return false;
      if (filters.brand && p.brand !== filters.brand) return false;
      if (filters.condition && p.condition !== filters.condition) return false;
      if (filters.stockStatus && p.stockStatus !== filters.stockStatus) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      condition: '',
      minPrice: 0,
      maxPrice: 1000000,
      stockStatus: '',
      sort: 'newest',
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.condition,
    filters.stockStatus,
    filters.minPrice > 0 ? 'price' : '',
    filters.maxPrice < 1000000 ? 'maxprice' : '',
  ].filter(Boolean).length;

  return (
    <div>
      {/* Search & toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Rechercher un produit, une marque..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value as SortOption)}
            className="px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex gap-1 p-1 bg-zinc-900 border border-zinc-700 rounded-lg">
            <button
              onClick={() => setGridView(true)}
              className={`p-1.5 rounded ${gridView ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-1.5 rounded ${!gridView ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <div className="mb-6 p-5 bg-zinc-900 border border-zinc-700 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-200">Filtres</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
              >
                Réinitialiser tout
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Marque
              </label>
              <select
                value={filters.brand}
                onChange={(e) => setFilter('brand', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Toutes les marques</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                État
              </label>
              <select
                value={filters.condition}
                onChange={(e) => setFilter('condition', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Tous les états</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Disponibilité
              </label>
              <select
                value={filters.stockStatus}
                onChange={(e) => setFilter('stockStatus', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Toutes</option>
                {STOCK_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price range */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Prix minimum (FCFA)
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => setFilter('minPrice', Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Prix maximum (FCFA)
              </label>
              <input
                type="number"
                value={filters.maxPrice >= 1000000 ? '' : filters.maxPrice}
                onChange={(e) =>
                  setFilter('maxPrice', Number(e.target.value) || 1000000)
                }
                placeholder="Sans limite"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-zinc-200">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'produit trouvé' : 'produits trouvés'}
        </p>
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">
                {filters.category}
                <button onClick={() => setFilter('category', '')} className="text-zinc-500 hover:text-zinc-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.brand && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">
                {filters.brand}
                <button onClick={() => setFilter('brand', '')} className="text-zinc-500 hover:text-zinc-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.condition && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full border border-zinc-700">
                {filters.condition}
                <button onClick={() => setFilter('condition', '')} className="text-zinc-500 hover:text-zinc-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div
          className={
            gridView
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          }
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">Aucun produit trouvé</h3>
          <p className="text-zinc-600 mb-5">
            Essayez de modifier vos filtres ou contactez-nous directement.
          </p>
          <button onClick={resetFilters} className="btn-outline">
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
