
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Beurre de Karité Bio',
      price: 24.90,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop',
      origin: 'Ghana'
    },
    {
      id: 2,
      name: 'Huile de Baobab',
      price: 32.50,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop',
      origin: 'Sénégal'
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 6.90;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <Header />
      
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
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-800">Mon Panier LOUMO</h1>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
              </span>
            </div>

            {cartItems.length === 0 ? (
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
                {cartItems.map((item) => (
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
                          <p className="text-sm text-gray-600 mb-2">Origine: {item.origin}</p>
                          <p className="text-lg font-bold text-orange-600">{item.price.toFixed(2)}€</p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-600 transition-colors"
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
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border border-orange-200 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Récapitulatif</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{subtotal.toFixed(2)}€</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                        {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                      </span>
                    </div>
                    
                    {shipping > 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <Truck className="h-4 w-4 inline mr-2" />
                        Livraison gratuite dès 50€ d'achat
                      </div>
                    )}
                    
                    <hr className="border-orange-200" />
                    
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>{total.toFixed(2)}€</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 mb-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
                    Procéder au paiement
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
