import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Order } from '@/services/OrderService';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const handleExternalTracking = () => {
    if (order.trackingNumber) {
      const trackingUrl = `https://tracking.example.com/track/${order.trackingNumber}`;
      window.open(trackingUrl, '_blank');
    }
  };

  const getTrackingStatus = () => {
    switch (order.status) {
      case 'PENDING':
        return { status: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> };
      case 'CONFIRMED':
        return { status: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: <Package className="h-4 w-4" /> };
      case 'PROCESSING':
        return { status: 'En préparation', color: 'bg-orange-100 text-orange-800', icon: <Package className="h-4 w-4" /> };
      case 'SHIPPED':
        return { status: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-4 w-4" /> };
      case 'DELIVERED':
        return { status: 'Livrée', color: 'bg-green-100 text-green-800', icon: <Package className="h-4 w-4" /> };
      case 'CANCELLED':
        return { status: 'Annulée', color: 'bg-red-100 text-red-800', icon: <AlertCircle className="h-4 w-4" /> };
      default:
        return { status: 'Inconnu', color: 'bg-gray-100 text-gray-800', icon: <Package className="h-4 w-4" /> };
    }
  };

  const trackingInfo = getTrackingStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Suivi du colis
          </DialogTitle>
          <DialogDescription>
            Suivez votre commande {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations de la commande */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Numéro de commande</span>
                  <span className="text-sm text-gray-600">{order.orderNumber}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Statut actuel</span>
                  <Badge className={trackingInfo.color}>
                    <span className="flex items-center gap-1">
                      {trackingInfo.icon}
                      {trackingInfo.status}
                    </span>
                  </Badge>
                </div>
                
                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Numéro de suivi</span>
                    <span className="text-sm text-gray-600 font-mono">{order.trackingNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Date de commande</span>
                  <span className="text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                
                {order.shippedDate && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Date d'expédition</span>
                    <span className="text-sm text-gray-600">
                      {new Date(order.shippedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                
                {order.deliveredDate && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Date de livraison</span>
                    <span className="text-sm text-gray-600">
                      {new Date(order.deliveredDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Adresse de livraison */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-red-600 mt-1" />
                <div>
                  <p className="font-medium">Adresse de livraison</p>
                  <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            {order.trackingNumber ? (
              <Button 
                className="w-full" 
                onClick={handleExternalTracking}
                variant="outline"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Suivre sur le site du transporteur
              </Button>
            ) : (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-yellow-800">
                  Votre commande n'a pas encore de numéro de suivi.
                  <br />
                  Contactez le support pour plus d'informations.
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
