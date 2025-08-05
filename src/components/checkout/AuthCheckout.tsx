import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { CheckoutForm } from './CheckoutForm';

interface AuthCheckoutProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

export const AuthCheckout: React.FC<AuthCheckoutProps> = ({ onBack, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return <CheckoutForm onBack={onBack} onSuccess={onSuccess} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/90 backdrop-blur-sm border border-orange-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Connexion requise
          </CardTitle>
          <CardDescription className="text-gray-600">
            Vous devez être connecté pour finaliser votre commande
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <ShoppingBag className="h-4 w-4" />
            <AlertDescription>
              Pour votre sécurité et pour suivre vos commandes, nous vous demandons de vous connecter ou de créer un compte.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/login?redirect=checkout'} 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              size="lg"
            >
              <User className="h-5 w-5 mr-2" />
              Se connecter
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full"
            >
              Retour au panier
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Pas encore de compte ?</p>
            <Button 
              variant="link" 
              onClick={() => window.location.href = '/login?redirect=checkout&register=true'}
              className="text-orange-600 hover:text-orange-700 p-0 h-auto"
            >
              Créer un compte gratuitement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 