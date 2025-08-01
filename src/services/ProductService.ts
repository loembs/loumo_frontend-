import { Product, ProductSearchParams } from '@/types/product';
import { ProductCacheService } from './ProductCacheService';

export class ProductService {
  private static readonly API_BASE_URL = 'https://back-lomou.onrender.com/api/product';

  static async getProducts(params?: ProductSearchParams): Promise<Product[]> {
    try {
      // 1. Vérifier le cache d'abord
      const cached = ProductCacheService.getCachedProducts();
      
      if (cached && !ProductCacheService.isCacheStale()) {
        console.log('📦 Utilisation du cache produits (frais)');
        return this.filterProducts(cached.products, params);
      }

      // 2. Si cache expiré, charger depuis l'API
      const products = await this.fetchProductsFromAPI();
      ProductCacheService.saveProducts(products);
      
      console.log('🔄 Produits chargés depuis l\'API et mis en cache');
      return this.filterProducts(products, params);
      
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      
      // 3. Fallback: utiliser le cache même expiré
      const cached = ProductCacheService.getCachedProducts();
      if (cached) {
        console.log('⚠️ Utilisation du cache expiré (fallback)');
        return this.filterProducts(cached.products, params);
      }
      
      return [];
    }
  }

  static async refreshProducts(): Promise<Product[]> {
    try {
      console.log('🔄 Actualisation forcée des produits...');
      const products = await this.fetchProductsFromAPI();
      ProductCacheService.saveProducts(products);
      return products;
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
      throw error;
    }
  }

  static getCacheInfo() {
    return ProductCacheService.getCacheInfo();
  }

  static clearCache() {
    ProductCacheService.clearCache();
  }

  private static async fetchProductsFromAPI(): Promise<Product[]> {
    // Simulation d'appel API - à remplacer par ton vrai endpoint
    const response = await fetch(this.API_BASE_URL);
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des produits');
    }
    
    const products: Product[] = await response.json();
    return products;
  }

  private static filterProducts(products: Product[], params?: ProductSearchParams): Product[] {
    let filtered = [...products];

    // Recherche textuelle
    if (params?.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
} 