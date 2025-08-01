import { 
  Cart, 
  CartItem, 
  CartValidationResult, 
  AddToCartRequest, 
  UpdateCartItemRequest, 
  RemoveFromCartRequest 
} from '@/types/cart';
import { CartValidationService } from './CartValidationService';
import { CartStorageService } from './CartStorageService';
import { CartCalculationService } from './CartCalculationService';

export class CartService {
  private cart: Cart;

  constructor() {
    // Charger le panier depuis le localStorage au démarrage
    const savedCart = CartStorageService.loadCart();
    this.cart = savedCart || this.getEmptyCart();
  }

  private getEmptyCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: 0
    };
  }

  private updateCartCalculations(): void {
    this.cart = CartCalculationService.calculateCart(this.cart);
  }

  private saveCart(): void {
    CartStorageService.saveCart(this.cart);
  }

  getCart(): Cart {
    return { ...this.cart };
  }

  addItem(request: AddToCartRequest): CartValidationResult {
    // Validation avant ajout
    const validation = CartValidationService.validateAddItem(
      request.item, 
      request.quantity, 
      this.cart.items
    );

    if (!validation.isValid) {
      return validation;
    }

    // Vérifier si l'article existe déjà
    const existingItemIndex = this.cart.items.findIndex(
      item => item.id === request.item.id
    );

    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité de l'article existant
      this.cart.items[existingItemIndex].quantity += request.quantity;
    } else {
      // Ajouter un nouvel article
      const newItem: CartItem = {
        ...request.item,
        quantity: request.quantity
      };
      this.cart.items.push(newItem);
    }

    // Recalculer les totaux
    this.updateCartCalculations();
    
    // Sauvegarder dans le localStorage
    this.saveCart();

    return validation;
  }

  updateItem(request: UpdateCartItemRequest): CartValidationResult {
    // Validation avant mise à jour
    const validation = CartValidationService.validateUpdateItem(
      request.itemId, 
      request.quantity, 
      this.cart.items
    );

    if (!validation.isValid) {
      return validation;
    }

    const itemIndex = this.cart.items.findIndex(
      item => item.id === request.itemId
    );

    if (itemIndex === -1) {
      return {
        isValid: false,
        errors: ['Article non trouvé dans le panier'],
        warnings: []
      };
    }

    if (request.quantity === 0) {
      // Supprimer l'article si la quantité est 0
      this.cart.items.splice(itemIndex, 1);
    } else {
      // Mettre à jour la quantité
      this.cart.items[itemIndex].quantity = request.quantity;
    }

    // Recalculer les totaux
    this.updateCartCalculations();
    
    // Sauvegarder dans le localStorage
    this.saveCart();

    return validation;
  }

  removeItem(request: RemoveFromCartRequest): void {
    this.cart.items = this.cart.items.filter(
      item => item.id !== request.itemId
    );

    // Recalculer les totaux
    this.updateCartCalculations();
    
    // Sauvegarder dans le localStorage
    this.saveCart();
  }

  clearCart(): void {
    this.cart = this.getEmptyCart();
    CartStorageService.clearCart();
  }

  validateCart(): CartValidationResult {
    return CartValidationService.validateCart(this.cart);
  }

  saveToStorage(): void {
    this.saveCart();
  }

  loadFromStorage(): void {
    const savedCart = CartStorageService.loadCart();
    if (savedCart) {
      this.cart = savedCart;
    }
  }

  // Méthodes utilitaires
  getItemById(itemId: string): CartItem | undefined {
    return this.cart.items.find(item => item.id === itemId);
  }

  getItemCount(): number {
    return this.cart.itemCount;
  }

  getSubtotal(): number {
    return this.cart.subtotal;
  }

  getTotal(): number {
    return this.cart.total;
  }

  getShippingCost(): number {
    return this.cart.shipping;
  }

  isCartEmpty(): boolean {
    return this.cart.items.length === 0;
  }

  getShippingInfo() {
    return CartCalculationService.getShippingInfo(this.cart.subtotal);
  }

  getShippingOptions() {
    return CartCalculationService.getShippingOptions(this.cart.subtotal);
  }

  // Méthodes pour les notifications et événements
  onCartChange(callback: (cart: Cart) => void): void {
    // Cette méthode pourrait être utilisée pour notifier les composants
    // des changements dans le panier (pattern Observer)
    callback(this.cart);
  }

  // Méthodes pour la gestion des erreurs
  handleError(error: Error): void {
    console.error('Erreur dans le service de panier:', error);
    // Ici on pourrait ajouter la logique pour gérer les erreurs
    // comme envoyer des analytics, notifier l'utilisateur, etc.
  }

  // Méthodes pour les analytics
  trackCartEvent(event: string, data?: any): void {
    // Ici on pourrait ajouter la logique pour tracker les événements
    // comme l'ajout d'articles, la suppression, etc.
    console.log('Cart event:', event, data);
  }
} 