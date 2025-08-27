export interface Shop {
  id: number;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address: string;
  city: string;
  country: string;
  status: ShopStatus;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number;
  totalReviews: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
  owner: User;
  productCount: number;
  featuredProducts: Product[];
}

export enum ShopStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}

export interface CreateShopRequest {
  name: string;
  description: string;
  contactEmail?: string;
  contactPhone?: string;
  address: string;
  city: string;
  country: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface ShopReview {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  available: boolean;
  isFeatured: boolean;
  totalSales: number;
  viewCount: number;
}

