import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Truck, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/OrderService';
import { CartCalculationService } from '@/services/CartCalculationService';
import { paymentService, PaymentInfo } from '@/services/PaymentService';

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onBack, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { cart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Informations de livraison
  const [shippingInfo, setShippingInfo] = useState({
    customerName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    phoneNumber: '',
    shippingAddress: '',
    notes: ''
  });
  
  // Méthode de paiement
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'cash_on_delivery'>('card');
  
  // Informations de paiement (pour paiement en ligne)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        customerName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : prev.customerName
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!shippingInfo.customerName.trim()) return 'Le nom du client est requis';
    if (!shippingInfo.phoneNumber.trim()) return 'Le numéro de téléphone est requis';
    if (!shippingInfo.shippingAddress.trim()) return 'L\'adresse de livraison est requise';
    
    if (paymentMethod === 'card') {
      if (!paymentInfo.cardNumber.trim()) return 'Le numéro de carte est requis';
      if (!paymentInfo.expiryDate.trim()) return 'La date d\'expiration est requise';
      if (!paymentInfo.cvv.trim()) return 'Le code CVV est requis';
      if (!paymentInfo.cardholderName.trim()) return 'Le nom du titulaire est requis';
    }
    
    return null;
  };

  const processPayment = async () => {
    const paymentData: PaymentInfo = {
      method: paymentMethod,
      amount: cart.total,
      currency: 'XOF',
      cardInfo: paymentMethod === 'card' ? {
        number: paymentInfo.cardNumber,
        expiryDate: paymentInfo.expiryDate,
        cvv: paymentInfo.cvv,
        cardholderName: paymentInfo.cardholderName
      } : undefined,
      mobileMoneyInfo: paymentMethod === 'mobile_money' ? {
        phoneNumber: shippingInfo.phoneNumber,
        provider: 'orange' // Par défaut
      } : undefined
    };

    const result = await paymentService.processPayment(paymentData);
    return result.success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Traiter le paiement si nécessaire
      if (paymentMethod !== 'cash_on_delivery') {
        const paymentSuccess = await processPayment();
        if (!paymentSuccess) {
          throw new Error('Le paiement a échoué. Veuillez réessayer.');
        }
      }

      // Créer la commande
      const orderRequest = {
        shippingAddress: shippingInfo.shippingAddress,
        phoneNumber: shippingInfo.phoneNumber,
        customerName: shippingInfo.customerName,
        notes: shippingInfo.notes,
        items: cart.items.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity
        }))
      };

      const order = await orderService.createOrder(orderRequest);
      
      // Vider le panier
      await clearCart();
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess(order.orderNumber);
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h2>
          <p className="text-gray-600 mb-4">
            Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation.
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Numéro de commande :</strong> {cart.items.length > 0 ? 'CMD-' + Date.now() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au panier
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finaliser votre commande</h1>
          <p className="text-gray-600">Complétez vos informations pour finaliser votre achat</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Informations de livraison
              </CardTitle>
              <CardDescription>
                Où souhaitez-vous recevoir votre commande ?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Nom complet *</Label>
                <Input
                  id="customerName"
                  value={shippingInfo.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Numéro de téléphone *</Label>
                <Input
                  id="phoneNumber"
                  value={shippingInfo.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="shippingAddress">Adresse de livraison *</Label>
                <Textarea
                  id="shippingAddress"
                  value={shippingInfo.shippingAddress}
                  onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                  placeholder="123 Rue de la Paix, 75001 Paris, France"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes de livraison (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={shippingInfo.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Instructions spéciales pour la livraison..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Méthode de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Méthode de paiement
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez payer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Carte</TabsTrigger>
                  <TabsTrigger value="mobile_money">Mobile Money</TabsTrigger>
                  <TabsTrigger value="cash_on_delivery">À la livraison</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <Shield className="h-4 w-4 inline mr-2" />
                      Paiement sécurisé par carte bancaire
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Numéro de carte *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Date d'expiration *</Label>
                      <Input
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentInfoChange('expiryDate', e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentInfoChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardholderName">Nom du titulaire *</Label>
                    <Input
                      id="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                      placeholder="Nom tel qu'il apparaît sur la carte"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="mobile_money" className="space-y-4">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-700">
                      Paiement par Mobile Money (Orange Money, MTN Mobile Money, etc.)
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Vous recevrez un SMS avec les instructions de paiement après confirmation de la commande.
                  </p>
                </TabsContent>
                
                <TabsContent value="cash_on_delivery" className="space-y-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">
                      Paiement à la livraison
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Payez en espèces ou par carte lors de la livraison de votre commande.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Récapitulatif */}
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif de votre commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{CartCalculationService.formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              
              <hr className="border-gray-200" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{CartCalculationService.formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{CartCalculationService.formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de commande */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Traitement en cours...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Confirmer ma commande
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}; 