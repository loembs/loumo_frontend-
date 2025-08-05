import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  RefreshCw,
  Calendar,
  User,
  Package
} from 'lucide-react';
import { orderService, Order } from '@/services/OrderService';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  onStatusUpdate: (orderId: number, status: Order['status']) => void;
  onRefresh: () => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onOrderSelect,
  onStatusUpdate,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        default:
          return 0;
      }
    });

  const getStatusOptions = () => [
    { value: 'PENDING', label: 'En attente' },
    { value: 'CONFIRMED', label: 'Confirmée' },
    { value: 'PROCESSING', label: 'En cours' },
    { value: 'SHIPPED', label: 'Expédiée' },
    { value: 'DELIVERED', label: 'Livrée' },
    { value: 'CANCELLED', label: 'Annulée' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des Commandes</CardTitle>
            <CardDescription>
              {filteredOrders.length} commande(s) trouvée(s)
            </CardDescription>
          </div>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par numéro, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {getStatusOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (récent)</SelectItem>
              <SelectItem value="amount">Montant (élevé)</SelectItem>
              <SelectItem value="customer">Client (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                    <Badge className={orderService.getStatusColor(order.status)}>
                      {orderService.getStatusDisplayName(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{orderService.formatDate(order.orderDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{order.items.length} article(s)</span>
                    </div>
                  </div>
                  
                  {order.shippingAddress && (
                    <p className="text-sm text-gray-500 mt-2">
                      📍 {order.shippingAddress}
                    </p>
                  )}
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
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOrderSelect(order)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => onStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getStatusOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucune commande */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucune commande n\'a été passée pour le moment'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 