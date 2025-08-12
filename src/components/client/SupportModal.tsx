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
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock,
  MapPin 
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  orderNumber
}) => {
  const handleEmailSupport = () => {
    const subject = encodeURIComponent(`Support - Commande ${orderNumber}`);
    const body = encodeURIComponent(`
Bonjour,

J'ai besoin d'aide concernant ma commande ${orderNumber}.

Pouvez-vous m'aider ?

Cordialement,
    `);
    
    const mailtoLink = `mailto:support@loumo.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  const handleWhatsAppSupport = () => {
    const message = encodeURIComponent(`Bonjour, j'ai besoin d'aide concernant ma commande ${orderNumber}`);
    const whatsappLink = `https://wa.me/221771234567?text=${message}`;
    window.open(whatsappLink, '_blank');
  };

  const handleCallSupport = () => {
    window.open('tel:+221771234567', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contacter le support
          </DialogTitle>
          <DialogDescription>
            Nous sommes là pour vous aider avec votre commande {orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations de contact */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">support@loumo.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">+221 77 123 45 67</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-gray-600">Lun-Sam: 8h-18h</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-gray-600">Dakar, Sénégal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={handleEmailSupport}
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Envoyer un email
            </Button>
            
            <Button 
              className="w-full" 
              onClick={handleWhatsAppSupport}
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button 
              className="w-full" 
              onClick={handleCallSupport}
              variant="outline"
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler
            </Button>
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

