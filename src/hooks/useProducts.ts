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
      console.error('❌ Erreur dans useProducts:', err);
      
      let errorMessage = 'Erreur lors du chargement des produits';
      
      if (err instanceof Error) {
        // Messages d'erreur plus spécifiques
        if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
          errorMessage = 'Problème de connexion au serveur. Vérifiez votre connexion internet.';
        } else if (err.message.includes('503') || err.message.includes('indisponible')) {
          errorMessage = 'Le serveur est temporairement indisponible. Veuillez réessayer plus tard.';
        } else if (err.message.includes('timeout') || err.message.includes('délai')) {
          errorMessage = 'Le serveur met trop de temps à répondre. Veuillez réessayer.';
        } else {
          errorMessage = err.message;
        }
      }
      
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

  // Charger les produits au démarrage
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // WebSocket temporairement désactivé (erreur 405)
  // useEffect(() => {
  //   const handleProductUpdate = (message: any) => {
  //     console.log('🔄 Mise à jour produit reçue:', message);
  //     refreshProducts();
  //   };

  //   const handleCacheInvalidate = () => {
  //     console.log('🔄 Invalidation cache reçue');
  //     clearCache();
  //     loadProducts();
  //   };

  //   webSocketService.connect().then(() => {
  //     webSocketService.subscribe('productUpdate', handleProductUpdate);
  //     webSocketService.subscribe('cacheInvalidate', handleCacheInvalidate);
  //   }).catch(console.error);

  //   return () => {
  //     webSocketService.unsubscribe('productUpdate', handleProductUpdate);
  //     webSocketService.unsubscribe('cacheInvalidate', handleCacheInvalidate);
  //   };
  // }, [loadProducts, refreshProducts, clearCache]);

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