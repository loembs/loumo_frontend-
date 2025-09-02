import { Product, ProductSearchParams } from '@/types/product';
import { ProductCacheService } from './ProductCacheService';
import { API_BASE_URL, ENDPOINTS } from '@/config/constants';

export class ProductService {

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
      
      // 4. Fallback final: données locales
      console.log('🔄 Utilisation des données de fallback locales');
      const fallbackProducts = this.getFallbackProducts();
      return this.filterProducts(fallbackProducts, params);
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

  // Données de fallback en cas d'échec complet de l'API
  private static getFallbackProducts(): Product[] {
    return [
      {
        id: "1",
        name: "Boubou Traditionnel",
        description: "Boubou élégant en tissu wax authentique",
        price: 25000,
        category: { id: "1", name: "Boubous" },
        imageUrl: "/placeholder.svg",
        stock: 10,
        available: true
      },
      {
        id: "2",
        name: "Collier en Perles",
        description: "Collier traditionnel en perles colorées",
        price: 15000,
        category: { id: "2", name: "Bijoux" },
        imageUrl: "/placeholder.svg",
        stock: 5,
        available: true
      },
      {
        id: "3",
        name: "Robe Moderne",
        description: "Robe contemporaine inspirée des traditions",
        price: 35000,
        category: { id: "3", name: "Prêt-à-porter" },
        imageUrl: "/placeholder.svg",
        stock: 8,
        available: true
      }
    ];
  }

  private static async fetchProductsFromAPI(): Promise<Product[]> {
    try {
      console.log('🔄 Tentative de chargement depuis l\'API:', `${API_BASE_URL}${ENDPOINTS.PRODUCTS.ALL}`);
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PRODUCTS.ALL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Timeout simple de 15 secondes
        signal: AbortSignal.timeout(15000)
      });
      
      if (!response.ok) {
        console.error('❌ Erreur API:', response.status, response.statusText);
        
        if (response.status === 503) {
          throw new Error('Service temporairement indisponible. Veuillez réessayer plus tard.');
        }
        
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const products: Product[] = data.data || data; // Gérer les deux formats de réponse
      
      console.log('✅ Produits chargés depuis l\'API:', products.length);
      return products;
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des produits:', error);
      
      // Gestion spécifique des erreurs CORS et de connectivité
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Le serveur met trop de temps à répondre.');
      }
      
      // Relancer l'erreur pour la gestion dans getProducts
      throw error;
    }
  }

  private static filterProducts(products: Product[], params?: ProductSearchParams): Product[] {
    let filtered = [...products];

    // Recherche textuelle
    if (params?.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (typeof product.category === 'string' ? product.category : product.category.name).toLowerCase().includes(query)
      );
    }

    return filtered;
  }
} 