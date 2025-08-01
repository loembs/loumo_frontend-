import { CartItem, CartValidationResult } from '@/types/cart';

export class CartValidationService {
  private static readonly MAX_QUANTITY_PER_ITEM = 10;
  private static readonly MAX_ITEMS_IN_CART = 50;
  private static readonly MIN_ORDER_AMOUNT = 5;
  private static readonly MAX_ORDER_AMOUNT = 10000;

  static validateAddItem(item: Omit<CartItem, 'quantity'>, quantity: number, currentItems: CartItem[]): CartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation de la quantité
    if (quantity <= 0) {
      errors.push('La quantité doit être supérieure à 0');
    }

    if (quantity > this.MAX_QUANTITY_PER_ITEM) {
      errors.push(`La quantité maximale par article est de ${this.MAX_QUANTITY_PER_ITEM}`);
    }

    // Validation de la disponibilité
    if (item.available === false) {
      errors.push('Cet article n\'est plus disponible');
    }

    // Validation du prix
    if (item.price <= 0) {
      errors.push('Le prix de l\'article est invalide');
    }

    // Validation du stock maximum
    if (item.maxQuantity && quantity > item.maxQuantity) {
      errors.push(`Stock limité : seulement ${item.maxQuantity} articles disponibles`);
    }

    // Validation du nombre total d'articles dans le panier
    const totalItems = currentItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0) + quantity;
    if (totalItems > this.MAX_ITEMS_IN_CART) {
      errors.push(`Le panier ne peut contenir plus de ${this.MAX_ITEMS_IN_CART} articles`);
    }

    // Vérification si l'article existe déjà
    const existingItem = currentItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      const newTotalQuantity = existingItem.quantity + quantity;
      if (newTotalQuantity > this.MAX_QUANTITY_PER_ITEM) {
        errors.push(`Quantité totale de "${item.name}" ne peut dépasser ${this.MAX_QUANTITY_PER_ITEM}`);
      }
    }

    // Avertissements
    if (quantity > 5) {
      warnings.push('Vous avez sélectionné une grande quantité. Vérifiez votre commande.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateUpdateItem(itemId: string, quantity: number, currentItems: CartItem[]): CartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const existingItem = currentItems.find(item => item.id === itemId);
    if (!existingItem) {
      errors.push('Article non trouvé dans le panier');
      return { isValid: false, errors, warnings };
    }

    if (quantity <= 0) {
      errors.push('La quantité doit être supérieure à 0');
    }

    if (quantity > this.MAX_QUANTITY_PER_ITEM) {
      errors.push(`La quantité maximale par article est de ${this.MAX_QUANTITY_PER_ITEM}`);
    }

    if (existingItem.maxQuantity && quantity > existingItem.maxQuantity) {
      errors.push(`Stock limité : seulement ${existingItem.maxQuantity} articles disponibles`);
    }

    if (quantity > 5) {
      warnings.push('Vous avez sélectionné une grande quantité. Vérifiez votre commande.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateCart(cart: { items: CartItem[]; subtotal: number }): CartValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation du montant minimum
    if (cart.subtotal < this.MIN_ORDER_AMOUNT) {
      errors.push(`Le montant minimum de commande est de ${this.MIN_ORDER_AMOUNT}€`);
    }

    // Validation du montant maximum
    if (cart.subtotal > this.MAX_ORDER_AMOUNT) {
      errors.push(`Le montant maximum de commande est de ${this.MAX_ORDER_AMOUNT}€`);
    }

    // Validation des articles indisponibles
    const unavailableItems = cart.items.filter(item => item.available === false);
    if (unavailableItems.length > 0) {
      errors.push(`${unavailableItems.length} article(s) ne sont plus disponibles`);
    }

    // Avertissements
    if (cart.items.length === 0) {
      warnings.push('Votre panier est vide');
    }

    if (cart.subtotal > 1000) {
      warnings.push('Commande importante détectée. Contactez-nous pour des options de livraison spéciales.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
} 