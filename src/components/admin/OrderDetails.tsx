import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Package,
  Truck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { orderService, Order } from '@/services/OrderService';

interface OrderDetailsProps {
  order: Order;
  onStatusUpdate: (orderId: number, status: Order['status']) => void;
  onBack: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onStatusUpdate,
  onBack
}) => {
  const getStatusOptions = () => [
    { value: 'PENDING', label: 'En attente' },
    { value: 'CONFIRMED', label: 'Confirmée' },
    { value: 'PROCESSING', label: 'En cours de traitement' },
    { value: 'SHIPPED', label: 'Expédiée' },
    { value: 'DELIVERED', label: 'Livrée' },
    { value: 'CANCELLED', label: 'Annulée' },
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="h-4 w-4" />;
      case 'CONFIRMED':
      case 'PROCESSING':
        return <Package className="h-4 w-4" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-gray-600">Détails de la commande</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={orderService.getStatusColor(order.status)}>
            {getStatusIcon(order.status)}
            <span className="ml-2">{orderService.getStatusDisplayName(order.status)}</span>
          </Badge>
          <Select
            value={order.status}
            onValueChange={(value: Order['status']) => onStatusUpdate(order.id, value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Changer le statut" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-lg">{order.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {order.customerEmail}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {order.phoneNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresse de livraison</label>
                  <p className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Articles ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productName}</h4>
                      <p className="text-sm text-gray-500">
                        Quantité: {item.quantity} × {orderService.formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{orderService.formatPrice(item.totalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-2xl text-primary">
                  {orderService.formatPrice(order.totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informations de commande */}
        <div className="space-y-6">
          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Date de commande</label>
                <p className="text-lg">{orderService.formatDate(order.orderDate)}</p>
              </div>
              {order.shippedDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Date d'expédition</label>
                  <p className="text-lg">{orderService.formatDate(order.shippedDate)}</p>
                </div>
              )}
              {order.deliveredDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de livraison</label>
                  <p className="text-lg">{orderService.formatDate(order.deliveredDate)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => onStatusUpdate(order.id, 'CONFIRMED')}
                disabled={order.status !== 'PENDING'}
              >
                Confirmer la commande
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => onStatusUpdate(order.id, 'SHIPPED')}
                disabled={!['CONFIRMED', 'PROCESSING'].includes(order.status)}
              >
                Marquer comme expédiée
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => onStatusUpdate(order.id, 'DELIVERED')}
                disabled={order.status !== 'SHIPPED'}
              >
                Marquer comme livrée
              </Button>
              <Button 
                className="w-full" 
                variant="destructive"
                onClick={() => onStatusUpdate(order.id, 'CANCELLED')}
                disabled={['DELIVERED', 'CANCELLED'].includes(order.status)}
              >
                Annuler la commande
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 