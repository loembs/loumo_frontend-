import { Cart, CartItem } from '@/types/cart';

export class CartCalculationService {
  private static readonly FREE_SHIPPING_THRESHOLD = 50;
  private static readonly STANDARD_SHIPPING_COST = 6.90;
  private static readonly EXPRESS_SHIPPING_COST = 12.90;
  private static readonly INTERNATIONAL_SHIPPING_COST = 25.90;

  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  static calculateShipping(subtotal: number, shippingType: 'standard' | 'express' | 'international' = 'standard'): number {
    // Livraison gratuite si le seuil est atteint
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    // Calcul selon le type de livraison
    switch (shippingType) {
      case 'express':
        return this.EXPRESS_SHIPPING_COST;
      case 'international':
        return this.INTERNATIONAL_SHIPPING_COST;
      default:
        return this.STANDARD_SHIPPING_COST;
    }
  }

  static calculateTotal(subtotal: number, shipping: number): number {
    return subtotal + shipping;
  }

  static calculateItemCount(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  static calculateCart(cart: { items: CartItem[] }): Cart {
    const subtotal = this.calculateSubtotal(cart.items);
    const shipping = this.calculateShipping(subtotal);
    const total = this.calculateTotal(subtotal, shipping);
    const itemCount = this.calculateItemCount(cart.items);

    return {
      items: cart.items,
      subtotal,
      shipping,
      total,
      itemCount
    };
  }

  static getShippingInfo(subtotal: number): {
    cost: number;
    isFree: boolean;
    remainingForFree: number;
    type: string;
  } {
    const isFree = subtotal >= this.FREE_SHIPPING_THRESHOLD;
    const cost = isFree ? 0 : this.STANDARD_SHIPPING_COST;
    const remainingForFree = isFree ? 0 : this.FREE_SHIPPING_THRESHOLD - subtotal;

    return {
      cost,
      isFree,
      remainingForFree,
      type: isFree ? 'Gratuite' : 'Standard'
    };
  }

  static calculateDiscount(originalPrice: number, discountedPrice: number): {
    amount: number;
    percentage: number;
  } {
    const amount = originalPrice - discountedPrice;
    const percentage = originalPrice > 0 ? (amount / originalPrice) * 100 : 0;

    return {
      amount,
      percentage: Math.round(percentage)
    };
  }

  static calculateSavings(items: CartItem[]): {
    totalSavings: number;
    savingsBreakdown: Array<{
      itemId: string;
      itemName: string;
      savings: number;
    }>;
  } {
    let totalSavings = 0;
    const savingsBreakdown: Array<{
      itemId: string;
      itemName: string;
      savings: number;
    }> = [];

    items.forEach(item => {
      // Ici on pourrait ajouter la logique pour calculer les économies
      // basées sur les prix originaux vs prix actuels
      // Pour l'instant, on retourne 0
      savingsBreakdown.push({
        itemId: item.id,
        itemName: item.name,
        savings: 0
      });
    });

    return {
      totalSavings,
      savingsBreakdown
    };
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 2
    }).format(price);
  }

  static getShippingOptions(subtotal: number): Array<{
    type: string;
    cost: number;
    estimatedDays: string;
    isRecommended: boolean;
  }> {
    const isFreeEligible = subtotal >= this.FREE_SHIPPING_THRESHOLD;

    return [
      {
        type: 'Standard',
        cost: isFreeEligible ? 0 : this.STANDARD_SHIPPING_COST,
        estimatedDays: '3-5 jours',
        isRecommended: true
      },
      {
        type: 'Express',
        cost: this.EXPRESS_SHIPPING_COST,
        estimatedDays: '1-2 jours',
        isRecommended: false
      },
      {
        type: 'International',
        cost: this.INTERNATIONAL_SHIPPING_COST,
        estimatedDays: '5-10 jours',
        isRecommended: false
      }
    ];
  }
} 