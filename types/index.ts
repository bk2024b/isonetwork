export interface ProductImage {
  url: string;
  alt: string;
}

export type ProductCondition = 'Neuf' | 'Occasion A+' | 'Reconditionné';
export type ProductCategory =
  | 'Ordinateurs portables'
  | 'Ordinateurs de bureau'
  | 'Accessoires'
  | 'Matériel bureautique';
export type StockStatus = 'En stock' | 'Stock limité' | 'Rupture de stock';

export interface ProductSpec {
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  graphics?: string;
  battery?: string;
  os?: string;
  connectivity?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  specs: ProductSpec;
  included: string[];
  warranty: string;
  stockStatus: StockStatus;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsData {
  products: Product[];
  updatedAt: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  stockStatus: string;
  sort: SortOption;
}
