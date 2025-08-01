import { Cart, CartItem } from '@/types/cart';

export class CartStorageService {
  private static readonly STORAGE_KEY = 'loumo_cart';
  private static readonly STORAGE_VERSION = '1.0';

  static saveCart(cart: Cart): void {
    try {
      const cartData = {
        version: this.STORAGE_VERSION,
        timestamp: Date.now(),
        data: cart
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
      // Fallback: essayer de sauvegarder sans timestamp
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
      } catch (fallbackError) {
        console.error('Erreur lors de la sauvegarde de fallback:', fallbackError);
      }
    }
  }

  static loadCart(): Cart | null {
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      if (!cartData) {
        return null;
      }

      const parsed = JSON.parse(cartData);
      
      // Vérifier si c'est l'ancien format (sans version)
      if (!parsed.version) {
        // Migration de l'ancien format
        return this.migrateOldCartFormat(parsed);
      }

      // Vérifier la version
      if (parsed.version !== this.STORAGE_VERSION) {
        console.warn('Version du panier différente, migration nécessaire');
        return this.migrateCartVersion(parsed);
      }

      // Vérifier si les données ne sont pas trop anciennes (7 jours)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (parsed.timestamp && parsed.timestamp < sevenDaysAgo) {
        console.warn('Panier trop ancien, suppression');
        this.clearCart();
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      this.clearCart();
      return null;
    }
  }

  static clearCart(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
    }
  }

  static getCartSize(): number {
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      if (!cartData) return 0;

      const parsed = JSON.parse(cartData);
      const cart = parsed.version ? parsed.data : parsed;
      
      return cart.items?.length || 0;
    } catch (error) {
      console.error('Erreur lors du calcul de la taille du panier:', error);
      return 0;
    }
  }

  static isCartEmpty(): boolean {
    return this.getCartSize() === 0;
  }

  private static migrateOldCartFormat(oldCart: any): Cart {
    // Migration depuis l'ancien format
    const items: CartItem[] = Array.isArray(oldCart) 
      ? oldCart.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || 'Article inconnu',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: item.image || '',
          origin: item.origin || '',
          category: item.category || '',
          available: item.available !== false
        }))
      : [];

    return {
      items,
      subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shipping: 0,
      total: 0,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  private static migrateCartVersion(parsedCart: any): Cart {
    // Pour l'instant, on retourne les données telles quelles
    // À l'avenir, on pourra ajouter des migrations spécifiques par version
    return parsedCart.data;
  }

  static exportCart(): string {
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      return cartData || '';
    } catch (error) {
      console.error('Erreur lors de l\'export du panier:', error);
      return '';
    }
  }

  static importCart(cartData: string): boolean {
    try {
      const parsed = JSON.parse(cartData);
      if (parsed.version && parsed.data) {
        localStorage.setItem(this.STORAGE_KEY, cartData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import du panier:', error);
      return false;
    }
  }
} 