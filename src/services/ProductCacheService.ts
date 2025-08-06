import { Product } from '@/types/product';

export interface CachedProductData {
  version: string;
  timestamp: number;
  lastModified: number;
  products: Product[];
  categories: string[];
  totalCount: number;
}

export class ProductCacheService {
  private static readonly CACHE_KEY = 'loumo_products_cache';
  private static readonly CACHE_VERSION = '1.0';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private static readonly STALE_WHILE_REVALIDATE = 5 * 60 * 1000; // 5 minutes

  static saveProducts(products: Product[], lastModified?: number): void {
    try {
      // Valider et nettoyer les données avant sauvegarde
      const validProducts = products.filter(product => {
        if (!product || typeof product !== 'object') {
          console.warn('Produit invalide ignoré:', product);
          return false;
        }
        return true;
      });

      const cacheData: CachedProductData = {
        version: this.CACHE_VERSION,
        timestamp: Date.now(),
        lastModified: lastModified || Date.now(),
        products: validProducts,
        categories: [...new Set(validProducts.map(p => {
          try {
            if (!p.category) {
              return 'Autre';
            } else if (typeof p.category === 'string') {
              return p.category;
            } else if (p.category && typeof p.category === 'object' && p.category.name) {
              return p.category.name;
            } else {
              return 'Autre'; // Catégorie par défaut
            }
          } catch (error) {
            console.warn('Erreur lors du traitement de la catégorie:', error);
            return 'Autre';
          }
        }).filter(Boolean))],
        totalCount: validProducts.length
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cache produits:', error);
    }
  }

  static getCachedProducts(): CachedProductData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const data: CachedProductData = JSON.parse(cached);
      
      // Vérifier la version
      if (data.version !== this.CACHE_VERSION) {
        this.clearCache();
        return null;
      }

      // Vérifier si le cache est expiré
      const isExpired = Date.now() - data.timestamp > this.CACHE_DURATION;
      if (isExpired) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors du chargement du cache produits:', error);
      this.clearCache();
      return null;
    }
  }

  static isCacheStale(): boolean {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return true;

      const data: CachedProductData = JSON.parse(cached);
      return Date.now() - data.timestamp > this.STALE_WHILE_REVALIDATE;
    } catch (error) {
      return true;
    }
  }

  static getLastModified(): number | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const data: CachedProductData = JSON.parse(cached);
      return data.lastModified;
    } catch (error) {
      return null;
    }
  }

  static clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du cache:', error);
    }
  }

  static getCacheInfo(): {
    exists: boolean;
    isStale: boolean;
    age: number;
    productCount: number;
  } {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) {
        return { exists: false, isStale: true, age: 0, productCount: 0 };
      }

      const data: CachedProductData = JSON.parse(cached);
      const age = Date.now() - data.timestamp;
      const isStale = age > this.STALE_WHILE_REVALIDATE;

      return {
        exists: true,
        isStale,
        age,
        productCount: data.products.length
      };
    } catch (error) {
      return { exists: false, isStale: true, age: 0, productCount: 0 };
    }
  }

  static updateProduct(productId: string, updates: Partial<Product>): void {
    try {
      const cached = this.getCachedProducts();
      if (!cached) return;

      const updatedProducts = cached.products.map(product => 
        product.id === productId ? { ...product, ...updates } : product
      );

      this.saveProducts(updatedProducts, cached.lastModified);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  }

  static removeProduct(productId: string): void {
    try {
      const cached = this.getCachedProducts();
      if (!cached) return;

      const updatedProducts = cached.products.filter(product => product.id !== productId);
      this.saveProducts(updatedProducts, cached.lastModified);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  }

  static addProduct(product: Product): void {
    try {
      const cached = this.getCachedProducts();
      if (!cached) return;

      const updatedProducts = [...cached.products, product];
      this.saveProducts(updatedProducts, cached.lastModified);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    }
  }

  static getProductsByCategory(category: string): Product[] {
    try {
      const cached = this.getCachedProducts();
      if (!cached) return [];

      return cached.products.filter(product => product.category === category);
    } catch (error) {
      console.error('Erreur lors du filtrage par catégorie:', error);
      return [];
    }
  }

  static searchProducts(query: string): Product[] {
    try {
      const cached = this.getCachedProducts();
      if (!cached) return [];

      const lowercaseQuery = query.toLowerCase();
      return cached.products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        (typeof product.category === 'string' ? product.category : product.category.name).toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }
  }
} 