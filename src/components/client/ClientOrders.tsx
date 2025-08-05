import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Package, 
  Calendar,
  MapPin,
  Phone,
  Eye,
  RefreshCw
} from 'lucide-react';
import { orderService, Order } from '@/services/OrderService';
import { ClientOrderDetails } from './ClientOrderDetails';

export const ClientOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getMyOrders();
      setOrders(ordersData);
    } catch (err) {
      setError('Erreur lors du chargement de vos commandes');
      console.error('Erreur commandes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erreur</h3>
              <p>{error}</p>
              <Button onClick={loadOrders} className="mt-4">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <ClientOrderDetails 
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
          <p className="text-gray-600">Suivez l'état de vos commandes</p>
        </div>
        <Button onClick={loadOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher une commande..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'Aucune commande trouvée' : 'Aucune commande'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Vous n\'avez pas encore passé de commande'
                  }
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => window.location.href = '/'}>
                    Découvrir nos produits
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <Badge className={orderService.getStatusColor(order.status)}>
                        {orderService.getStatusDisplayName(order.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Commandé le {orderService.formatDate(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{order.items.length} article(s)</span>
                      </div>
                    </div>

                    {/* Adresse de livraison */}
                    {order.shippingAddress && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{order.shippingAddress}</span>
                      </div>
                    )}

                    {/* Articles */}
                    <div className="text-sm text-gray-500">
                      {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                      {order.items.length > 2 && ` et ${order.items.length - 2} autre(s)`}
                    </div>
                  </div>

                  {/* Montant et actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {orderService.formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} article(s)
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les détails
                    </Button>
                  </div>
                </div>

                {/* Dates importantes */}
                {(order.shippedDate || order.deliveredDate) && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {order.shippedDate && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Package className="h-4 w-4" />
                          <span>Expédiée le {orderService.formatDate(order.shippedDate)}</span>
                        </div>
                      )}
                      {order.deliveredDate && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Calendar className="h-4 w-4" />
                          <span>Livrée le {orderService.formatDate(order.deliveredDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Statistiques rapides */}
      {orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résumé de vos commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-sm text-gray-500">Total commandes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </p>
                <p className="text-sm text-gray-500">Commandes livrées</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {orderService.formatPrice(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
                </p>
                <p className="text-sm text-gray-500">Total dépensé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 