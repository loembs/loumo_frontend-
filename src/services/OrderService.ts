import { API_BASE_URL } from '@/config/constants';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  orderDate: string;
  shippedDate?: string;
  deliveredDate?: string;
  shippingAddress: string;
  phoneNumber: string;
  customerName: string;
  customerEmail: string;
  notes?: string;
  trackingNumber?: string;
  items: OrderItem[];
}

export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  statusCounts: Record<string, number>;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  phoneNumber: string;
  customerName: string;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

class OrderService {
  private secureLog(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[OrderService] ${message}`, data || '');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    this.secureLog(`🌐 Requête vers: ${API_BASE_URL}${endpoint}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      this.secureLog(`📡 Réponse:`, {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}${endpoint}`
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.secureLog(`✅ Données reçues:`, data);
      return data;
    } catch (error) {
      this.secureLog(`❌ Erreur:`, error);
      throw error;
    }
  }

  // Créer une nouvelle commande (CLIENT)
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    return this.makeRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Obtenir les commandes de l'utilisateur connecté (CLIENT)
  async getMyOrders(): Promise<Order[]> {
    return this.makeRequest<Order[]>('/orders/my-orders');
  }

  // Obtenir une commande spécifique (CLIENT)
  async getMyOrder(orderId: number): Promise<Order> {
    return this.makeRequest<Order>(`/orders/my-orders/${orderId}`);
  }

  // Obtenir toutes les commandes (ADMIN)
  async getAllOrders(): Promise<Order[]> {
    return this.makeRequest<Order[]>('/orders/admin/all');
  }

  // Obtenir une commande spécifique (ADMIN)
  async getOrderById(orderId: number): Promise<Order> {
    return this.makeRequest<Order>(`/orders/${orderId}`);
  }

  // Mettre à jour le statut d'une commande (ADMIN)
  async updateOrderStatus(orderId: number, status: Order['status']): Promise<Order> {
    return this.makeRequest<Order>(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Obtenir les statistiques des commandes (ADMIN)
  async getOrderStatistics(): Promise<OrderStatistics> {
    return this.makeRequest<OrderStatistics>('/orders/admin/statistics');
  }

  // Obtenir le nom d'affichage du statut
  getStatusDisplayName(status: Order['status']): string {
    const statusNames = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      PROCESSING: 'En cours de traitement',
      SHIPPED: 'Expédiée',
      DELIVERED: 'Livrée',
      CANCELLED: 'Annulée',
    };
    return statusNames[status] || status;
  }

  // Obtenir la couleur du statut
  getStatusColor(status: Order['status']): string {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  // Formater le prix
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(price);
  }

  // Formater la date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export const orderService = new OrderService(); 