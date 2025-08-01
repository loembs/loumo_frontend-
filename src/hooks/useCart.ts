import { useState, useEffect, useCallback, useMemo } from 'react';
import { CartService } from '@/services/CartService';
import { 
  Cart, 
  CartItem, 
  CartValidationResult, 
  AddToCartRequest, 
  UpdateCartItemRequest, 
  RemoveFromCartRequest 
} from '@/types/cart';

// Instance singleton du service de panier
const cartService = new CartService();

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<CartValidationResult | null>(null);

  // Mettre à jour le panier quand il change
  const updateCart = useCallback(() => {
    setCart(cartService.getCart());
  }, []);

  // Ajouter un article au panier
  const addItem = useCallback(async (request: AddToCartRequest) => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = cartService.addItem(request);
      setValidationResult(result);
      
      if (result.isValid) {
        updateCart();
        // Tracker l'événement
        cartService.trackCartEvent('item_added', { item: request.item, quantity: request.quantity });
      } else {
        setError(result.errors.join(', '));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout au panier';
      setError(errorMessage);
      cartService.handleError(err as Error);
      return {
        isValid: false,
        errors: [errorMessage],
        warnings: []
      };
    } finally {
      setIsLoading(false);
    }
  }, [updateCart]);

  // Mettre à jour la quantité d'un article
  const updateItem = useCallback(async (request: UpdateCartItemRequest) => {
    setIsLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const result = cartService.updateItem(request);
      setValidationResult(result);
      
      if (result.isValid) {
        updateCart();
        cartService.trackCartEvent('item_updated', { itemId: request.itemId, quantity: request.quantity });
      } else {
        setError(result.errors.join(', '));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(errorMessage);
      cartService.handleError(err as Error);
      return {
        isValid: false,
        errors: [errorMessage],
        warnings: []
      };
    } finally {
      setIsLoading(false);
    }
  }, [updateCart]);

  // Supprimer un article du panier
  const removeItem = useCallback(async (request: RemoveFromCartRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      cartService.removeItem(request);
      updateCart();
      cartService.trackCartEvent('item_removed', { itemId: request.itemId });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      cartService.handleError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [updateCart]);

  // Vider le panier
  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      cartService.clearCart();
      updateCart();
      cartService.trackCartEvent('cart_cleared');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du vidage du panier';
      setError(errorMessage);
      cartService.handleError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [updateCart]);

  // Valider le panier
  const validateCart = useCallback(() => {
    const result = cartService.validateCart();
    setValidationResult(result);
    return result;
  }, []);

  // Recharger depuis le localStorage
  const reloadFromStorage = useCallback(() => {
    cartService.loadFromStorage();
    updateCart();
  }, [updateCart]);

  // Méthodes utilitaires
  const getItemById = useCallback((itemId: string) => {
    return cartService.getItemById(itemId);
  }, []);

  const getShippingInfo = useCallback(() => {
    return cartService.getShippingInfo();
  }, []);

  const getShippingOptions = useCallback(() => {
    return cartService.getShippingOptions();
  }, []);

  // Valeurs calculées
  const isCartEmpty = useMemo(() => cart.items.length === 0, [cart.items.length]);
  const itemCount = useMemo(() => cart.itemCount, [cart.itemCount]);
  const subtotal = useMemo(() => cart.subtotal, [cart.subtotal]);
  const total = useMemo(() => cart.total, [cart.total]);
  const shippingCost = useMemo(() => cart.shipping, [cart.shipping]);

  // Effet pour charger le panier au démarrage
  useEffect(() => {
    reloadFromStorage();
  }, [reloadFromStorage]);

  // Effet pour nettoyer les erreurs après un délai
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Effet pour nettoyer les résultats de validation après un délai
  useEffect(() => {
    if (validationResult) {
      const timer = setTimeout(() => {
        setValidationResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationResult]);

  return {
    // État
    cart,
    isLoading,
    error,
    validationResult,
    
    // Actions
    addItem,
    updateItem,
    removeItem,
    clearCart,
    validateCart,
    reloadFromStorage,
    
    // Méthodes utilitaires
    getItemById,
    getShippingInfo,
    getShippingOptions,
    
    // Valeurs calculées
    isCartEmpty,
    itemCount,
    subtotal,
    total,
    shippingCost
  };
}; 