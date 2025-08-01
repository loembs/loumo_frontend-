import { useState, useEffect, useCallback } from 'react';
import { Product, ProductSearchParams } from '@/types/product';
import { ProductService } from '@/services/ProductService';
import { webSocketService } from '@/services/WebSocketService';

export const useProducts = (params?: ProductSearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState(ProductService.getCacheInfo());

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ProductService.getProducts(params);
      setProducts(data);
      setCacheInfo(ProductService.getCacheInfo());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ProductService.refreshProducts();
      setProducts(data);
      setCacheInfo(ProductService.getCacheInfo());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'actualisation';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    ProductService.clearCache();
    setCacheInfo(ProductService.getCacheInfo());
  }, []);

  // WebSocket listeners
  useEffect(() => {
    const handleProductUpdate = (message: any) => {
      console.log('🔄 Mise à jour produit reçue:', message);
      // Actualiser automatiquement les produits
      refreshProducts();
    };

    const handleCacheInvalidate = () => {
      console.log('🔄 Invalidation cache reçue');
      // Vider le cache et recharger
      clearCache();
      loadProducts();
    };

    // Connecter WebSocket
    webSocketService.connect().then(() => {
      webSocketService.subscribe('productUpdate', handleProductUpdate);
      webSocketService.subscribe('cacheInvalidate', handleCacheInvalidate);
    }).catch(console.error);

    // Charger les produits au démarrage
    loadProducts();

    // Cleanup
    return () => {
      webSocketService.unsubscribe('productUpdate', handleProductUpdate);
      webSocketService.unsubscribe('cacheInvalidate', handleCacheInvalidate);
    };
  }, [loadProducts, refreshProducts, clearCache]);

  return {
    products,
    isLoading,
    error,
    cacheInfo,
    loadProducts,
    refreshProducts,
    clearCache
  };
}; 