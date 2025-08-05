import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  Calendar,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { orderService, Order } from '@/services/OrderService';

interface ClientOrderDetailsProps {
  order: Order;
  onBack: () => void;
}

export const ClientOrderDetails: React.FC<ClientOrderDetailsProps> = ({
  order,
  onBack
}) => {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
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

  const getStatusDescription = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Votre commande a été reçue et est en attente de confirmation.';
      case 'CONFIRMED':
        return 'Votre commande a été confirmée et sera traitée prochainement.';
      case 'PROCESSING':
        return 'Votre commande est en cours de préparation.';
      case 'SHIPPED':
        return 'Votre commande a été expédiée et est en route vers vous.';
      case 'DELIVERED':
        return 'Votre commande a été livrée avec succès.';
      case 'CANCELLED':
        return 'Votre commande a été annulée.';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-gray-600">Détails de votre commande</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statut de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                Statut de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={orderService.getStatusColor(order.status)}>
                  {orderService.getStatusDisplayName(order.status)}
                </Badge>
              </div>
              <p className="text-gray-600">
                {getStatusDescription(order.status)}
              </p>
            </CardContent>
          </Card>

          {/* Articles de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Articles commandés ({order.items.length})
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

        {/* Informations de livraison */}
        <div className="space-y-6">
          {/* Informations de livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-lg">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Téléphone</label>
                <p className="text-lg flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {order.phoneNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Adresse</label>
                <p className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {order.shippingAddress}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dates importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates importantes
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
                  <p className="text-lg flex items-center gap-2 text-green-600">
                    <Truck className="h-4 w-4" />
                    {orderService.formatDate(order.shippedDate)}
                  </p>
                </div>
              )}
              {order.deliveredDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de livraison</label>
                  <p className="text-lg flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {orderService.formatDate(order.deliveredDate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Contacter le support
              </Button>
              <Button className="w-full" variant="outline">
                Télécharger la facture
              </Button>
              <Button className="w-full" variant="outline">
                Suivre le colis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline de la commande */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi de votre commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Commande passée</p>
                <p className="text-sm text-gray-500">{orderService.formatDate(order.orderDate)}</p>
              </div>
            </div>
            
            {order.status !== 'PENDING' && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Commande confirmée</p>
                  <p className="text-sm text-gray-500">Votre commande a été confirmée</p>
                </div>
              </div>
            )}
            
            {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">En cours de préparation</p>
                  <p className="text-sm text-gray-500">Votre commande est en cours de préparation</p>
                </div>
              </div>
            )}
            
            {['SHIPPED', 'DELIVERED'].includes(order.status) && order.shippedDate && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Expédiée</p>
                  <p className="text-sm text-gray-500">{orderService.formatDate(order.shippedDate)}</p>
                </div>
              </div>
            )}
            
            {order.status === 'DELIVERED' && order.deliveredDate && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Livrée</p>
                  <p className="text-sm text-gray-500">{orderService.formatDate(order.deliveredDate)}</p>
                </div>
              </div>
            )}
            
            {order.status === 'CANCELLED' && (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Commande annulée</p>
                  <p className="text-sm text-gray-500">Votre commande a été annulée</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 