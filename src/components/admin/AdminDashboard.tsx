import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Calendar,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { orderService, Order, OrderStatistics } from '@/services/OrderService';
import { OrderList } from './OrderList';
import { OrderDetails } from './OrderDetails';
import { AddProductForm } from './AddProductForm';

export const AdminDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData] = await Promise.all([
        orderService.getOrderStatistics(),
        orderService.getAllOrders()
      ]);
      setStatistics(statsData);
      setOrders(ordersData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      await loadDashboardData(); // Recharger les statistiques
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

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
              <Button onClick={loadDashboardData} className="mt-4">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600">Gérez vos commandes et produits</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab('add-product')}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="add-product">Ajouter produit</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +20% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderService.formatPrice(statistics?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% par rapport au mois dernier
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes en Attente</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics?.statusCounts?.PENDING || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Nécessitent une attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes Livrées</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics?.statusCounts?.DELIVERED || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ce mois-ci
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Commandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
              <CardDescription>
                Les dernières commandes reçues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistics?.recentOrders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={orderService.getStatusColor(order.status)}>
                        {orderService.getStatusDisplayName(order.status)}
                      </Badge>
                      <p className="font-medium">{orderService.formatPrice(order.totalAmount)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveTab('orders');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liste des commandes */}
        <TabsContent value="orders" className="space-y-6">
          <OrderList 
            orders={orders}
            onOrderSelect={setSelectedOrder}
            onStatusUpdate={handleOrderStatusUpdate}
            onRefresh={loadDashboardData}
          />
        </TabsContent>

        {/* Détails d'une commande */}
        {selectedOrder && (
          <TabsContent value="order-details" className="space-y-6">
            <OrderDetails 
              order={selectedOrder}
              onStatusUpdate={handleOrderStatusUpdate}
              onBack={() => {
                setSelectedOrder(null);
                setActiveTab('orders');
              }}
            />
          </TabsContent>
        )}

        {/* Gestion des produits */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Produits</CardTitle>
              <CardDescription>
                Gérez votre catalogue de produits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Interface de gestion des produits à venir</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un produit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ajouter un produit */}
        <TabsContent value="add-product" className="space-y-6">
          <AddProductForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 