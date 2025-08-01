export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category?: {
    id: string;
    name: string;
  } | string; // Support both object and string for backward compatibility
  rating?: number;
  reviewCount?: number;
  skinType?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  available: boolean;
  stock: number;
  origin?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastModified?: string;
}

export interface ProductFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: boolean;
  tags?: string[];
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface ProductSearchParams {
  query?: string;
  filters?: ProductFilters;
  sort?: ProductSortOptions;
  page?: number;
  limit?: number;
} 