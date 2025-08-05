
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Truck, Package, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import CartNotifications from '@/components/CartNotifications';
import { CartCalculationService } from '@/services/CartCalculationService';
import { AuthCheckout } from '@/components/checkout/AuthCheckout';

const Cart = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  
  const {
    cart,
    isLoading,
    error,
    validationResult,
    updateItem,
    removeItem,
    clearCart,
    validateCart,
    getShippingInfo,
    getShippingOptions,
    isCartEmpty
  } = useCart();

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    await updateItem({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem({ itemId });
  };

  const handleClearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      await clearCart();
    }
  };

  const handleValidateCart = () => {
    const result = validateCart();
    if (!result.isValid) {
      console.log('Erreurs de validation:', result.errors);
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (orderId: string) => {
    setOrderSuccess(orderId);
    setShowCheckout(false);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
    setOrderSuccess(null);
  };

  const shippingInfo = getShippingInfo();
  const shippingOptions = getShippingOptions();

  // Afficher le checkout si demandé
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <AuthCheckout onBack={handleBackToCart} onSuccess={handleCheckoutSuccess} />
        </main>
        <Footer />
      </div>
    );
  }

  // Afficher le succès de commande
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-white/90 backdrop-blur-sm border border-green-200">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Commande confirmée !</h1>
                <p className="text-gray-600 mb-4">
                  Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-green-700">
                    <strong>Numéro de commande :</strong> {orderSuccess}
                  </p>
                </div>
                <div className="space-y-3">
                  <Link to="/orders">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                      Voir mes commandes
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" className="w-full">
                      Continuer mes achats
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Header />
      
      {/* Notifications */}
      <CartNotifications 
        validationResult={validationResult}
        error={error}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="flex items-center text-orange-600 hover:text-orange-700">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continuer mes achats
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-800">Mon Panier LOUMO</h1>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                  {cart.items.length} article{cart.items.length > 1 ? 's' : ''}
                </span>
              </div>
              
              {!isCartEmpty && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le panier
                </Button>
              )}
            </div>

            {cart.items.length === 0 ? (
              <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
                <CardContent>
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500 mb-6">Découvrez nos boubous, robes, bijoux et prêt-à-porter made in Africa</p>
                  <Link to="/products">
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                      Découvrir nos produits
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="bg-white/80 backdrop-blur-sm border border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                          {item.origin && (
                            <p className="text-sm text-gray-600 mb-2">Origine: {item.origin}</p>
                          )}
                          <p className="text-lg font-bold text-orange-600">
                            {CartCalculationService.formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50"
                              disabled={isLoading}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors disabled:opacity-50"
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.items.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{CartCalculationService.formatPrice(cart.subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className={`font-medium ${shippingInfo.isFree ? 'text-green-600' : ''}`}>
                        {shippingInfo.isFree ? 'Gratuite' : CartCalculationService.formatPrice(shippingInfo.cost)}
                      </span>
                    </div>
                    
                    {!shippingInfo.isFree && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <Truck className="h-4 w-4 inline mr-2" />
                        Plus que {CartCalculationService.formatPrice(shippingInfo.remainingForFree)} pour la livraison gratuite !
                      </div>
                    )}
                    
                    <hr className="border-orange-200" />
                    
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>{CartCalculationService.formatPrice(cart.total)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 mb-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                    disabled={isLoading}
                    onClick={handleValidateCart}
                  >
                    {isLoading ? 'Chargement...' : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Commander maintenant
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <button className="text-sm text-gray-600 hover:text-orange-600 flex items-center justify-center gap-2 mx-auto">
                      <Heart className="h-4 w-4" />
                      Sauvegarder pour plus tard
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
