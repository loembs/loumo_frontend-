import { Shop, CreateShopRequest } from '@/types/shop';
import { API_BASE_URL } from '@/config/constants';

export class ShopService {
  private static instance: ShopService;
  private baseUrl = `${API_BASE_URL}/shops`;

  static getInstance(): ShopService {
    if (!ShopService.instance) {
      ShopService.instance = new ShopService();
    }
    return ShopService.instance;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Gestion spéciale des erreurs d'authentification
        if (response.status === 401 || response.status === 403) {
          console.log('🔐 Erreur d\'authentification détectée');
          
          // Supprimer le token invalide
          localStorage.removeItem('token');
          
          // Créer un événement personnalisé pour informer l'application
          const authErrorEvent = new CustomEvent('authError', {
            detail: {
              message: 'Veuillez vous connecter pour accéder à cette fonctionnalité',
              redirectTo: '/login'
            }
          });
          window.dispatchEvent(authErrorEvent);
          
          throw new Error('Authentification requise');
        }
        
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la requête');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      // Si c'est une erreur d'authentification, la relancer
      if (error instanceof Error && error.message === 'Authentification requise') {
        throw error;
      }
      
      // Pour les autres erreurs, les gérer normalement
      console.error('❌ Erreur lors de la requête:', error);
      throw error;
    }
  }

  // Créer une nouvelle boutique
  async createShop(shopData: CreateShopRequest): Promise<Shop> {
    return this.request<Shop>('', {
      method: 'POST',
      body: JSON.stringify(shopData),
    });
  }

  // Obtenir toutes les boutiques actives
  async getAllShops(): Promise<Shop[]> {
    return this.request<Shop[]>('');
  }

  // Obtenir les boutiques mises en avant
  async getFeaturedShops(): Promise<Shop[]> {
    return this.request<Shop[]>('/featured');
  }

  // Obtenir les meilleures boutiques
  async getTopRatedShops(): Promise<Shop[]> {
    return this.request<Shop[]>('/top-rated');
  }

  // Rechercher des boutiques
  async searchShops(query: string): Promise<Shop[]> {
    return this.request<Shop[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  // Obtenir une boutique par son slug
  async getShopBySlug(slug: string): Promise<Shop> {
    return this.request<Shop>(`/${slug}`);
  }

  // Obtenir la boutique de l'utilisateur connecté
  async getMyShop(): Promise<Shop> {
    return this.request<Shop>('/my-shop');
  }

  // Obtenir le nombre de boutiques actives
  async getActiveShopsCount(): Promise<number> {
    return this.request<number>('/stats/count');
  }
}

export const shopService = ShopService.getInstance();

