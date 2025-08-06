import React, { useState } from 'react';
import { Package, Heart, Star, Users, Baby, User, Sparkles, ArrowRight, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import CartNotifications from '@/components/CartNotifications';

const Boxes = () => {
  const [selectedType, setSelectedType] = useState('femme');
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);
  const { addItem, isLoading, error, validationResult } = useCart();

  const boxTypes = [
    {
      id: 'femme',
      name: 'Box Femme',
      icon: User,
      description: 'Sélection de boubous, robes, bijoux et accessoires pour femme, 100% made in Africa',
      price: 69,
      originalPrice: 89,
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop',
      products: [
        { name: 'Boubou wax brodé', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop' },
        { name: 'Robe pagne africain', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop' },
        { name: 'Collier perles', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=150&h=150&fit=crop' },
        { name: 'Sac raphia', image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=150&h=150&fit=crop' }
      ],
      benefits: ['Élégance africaine', 'Artisanat local', 'Style unique', 'Accessoires tendance']
    },
    {
      id: 'homme',
      name: 'Box Homme',
      icon: Users,
      description: 'Sélection de vêtements et accessoires pour homme, 100% made in Africa',
      price: 59,
      originalPrice: 79,
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop',
      products: [
        { name: 'Boubou homme', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop' },
        { name: 'Bracelet cuir', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop' },
        { name: 'Chèche africain', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=150&h=150&fit=crop' }
      ],
      benefits: ['Style africain', 'Accessoires uniques', 'Confection artisanale', 'Look moderne']
    },
    {
      id: 'enfant',
      name: 'Box Enfant',
      icon: Baby,
      description: 'Vêtements et accessoires colorés pour enfants, 100% made in Africa',
      price: 39,
      originalPrice: 49,
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
      products: [
        { name: 'Robe enfant wax', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop' },
        { name: 'Petit sac tressé', image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop' },
        { name: 'Bracelet perles', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=150&h=150&fit=crop' }
      ],
      benefits: ['Couleurs vives', 'Confort', 'Artisanat africain', 'Accessoires ludiques']
    }
  ];

  const features = [
    'Produits 100% naturels',
    'Sélection personnalisée',
    'Livraison mensuelle',
    'Guide d\'utilisation inclus',
    'Ingrédients authentiques d\'Afrique'
  ];

  const selectedBox = boxTypes.find(box => box.id === selectedType);

  const handleAddToCart = async (box: any) => {
    await addItem({
      item: {
        id: `box-${box.id}`,
        name: box.name,
        price: box.price,
        image: box.image,
        origin: 'Sénégal',
        category: 'Box',
        available: true
      },
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDD0] to-[#FDF6E3]">
      <Header />
      
      {/* Notifications */}
      <CartNotifications 
        validationResult={validationResult}
        error={error}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="typography-hero text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FFFDD0] to-[#FAF3E0] bg-clip-text text-transparent">Loumo</span>
            <span className="text-[#D2A679]"> Box</span>
          </h1>
          <p className="typography-body-large text-gray-700 max-w-3xl mx-auto mb-8">
            Recevez chaque mois une sélection exclusive de vêtements, bijoux et accessoires africains, confectionnés au Sénégal. 100% made in Africa, du Sénégal vers le monde !
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FFFFF0]/80 backdrop-blur-sm px-6 py-3 rounded-full border border-[#F5F5DC] shadow-lg">
            <Package className="h-5 w-5 text-[#D2A679]" />
            <span className="typography-caption text-gray-700">Livraison gratuite dès la première box</span>
          </div>
        </div>

        {/* Box Types Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {boxTypes.map((box) => {
            const IconComponent = box.icon;
            const isSelected = selectedType === box.id;
            const isHovered = hoveredBox === box.id;
            const discount = Math.round(((box.originalPrice - box.price) / box.originalPrice) * 100);
            
            return (
              <div
                key={box.id}
                className="relative group perspective-1000"
                onMouseEnter={() => setHoveredBox(box.id)}
                onMouseLeave={() => setHoveredBox(null)}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-700 ease-out transform-gpu ${
                    isSelected 
                      ? 'ring-2 ring-orange-400 shadow-2xl bg-gradient-to-br from-orange-100 to-amber-100' 
                      : 'hover:shadow-2xl bg-white/80 backdrop-blur-sm'
                  } ${
                    isHovered 
                      ? 'scale-105 -translate-y-4 rotate-y-6 shadow-3xl' 
                      : 'hover:scale-102 hover:-translate-y-2'
                  }`}
                  style={{
                    transform: isHovered 
                      ? 'perspective(1000px) rotateY(8deg) rotateX(5deg) translateY(-16px) scale(1.05)' 
                      : 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)',
                    transformStyle: 'preserve-3d',
                    boxShadow: isHovered 
                      ? '0 25px 60px -12px rgba(0, 0, 0, 0.25), 0 20px 30px -20px rgba(249, 115, 22, 0.3)' 
                      : undefined
                  }}
                  onClick={() => setSelectedType(box.id)}
                >
                  <CardHeader className="text-center pb-4 relative overflow-hidden">
                    {/* Animated background */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-orange-400/10 to-amber-400/10 transition-opacity duration-500 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`} />
                    
                    {/* Discount Badge */}
                    <div className={`absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full typography-caption font-bold transition-all duration-300 ${
                      isHovered ? 'scale-110 rotate-12' : ''
                    }`}>
                      -{discount}%
                    </div>
                    
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-500 relative ${
                      isSelected ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-gray-100 to-gray-200'
                    } ${
                      isHovered ? 'scale-125 rotate-180 shadow-xl' : ''
                    }`}>
                      <IconComponent className={`h-10 w-10 transition-all duration-500 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      } ${
                        isHovered ? 'scale-110' : ''
                      }`} />
                      
                      {/* Floating particles effect */}
                      {isHovered && (
                        <>
                          <div className="absolute -top-2 -right-2 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-75" />
                          <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-amber-400 rounded-full animate-pulse" />
                          <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" />
                        </>
                      )}
                    </div>
                    <CardTitle className="typography-heading text-xl text-gray-800 relative z-10">{box.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center relative">
                    <div className="relative overflow-hidden rounded-lg mb-4 group">
                      <img 
                        src={box.image} 
                        alt={box.name}
                        className={`w-full h-40 object-cover transition-all duration-700 ${
                          isHovered ? 'scale-125 rotate-3' : 'group-hover:scale-110'
                        }`}
                      />
                      
                      {/* Floating product previews */}
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {box.products.slice(0, 3).map((product, index) => (
                            <div
                              key={index}
                              className="absolute w-16 h-16 rounded-lg overflow-hidden shadow-lg border-2 border-white/80 backdrop-blur-sm transition-all duration-700 hover:scale-110"
                              style={{
                                transform: `translate(${['-60px', '0px', '60px'][index]}, ${['-20px', '-40px', '-20px'][index]}) rotate(${[-15, 0, 15][index]}deg)`,
                                animationDelay: `${index * 100}ms`,
                                animation: 'float 3s ease-in-out infinite'
                              }}
                            >
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-500 flex items-end justify-center pb-4 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="flex items-center gap-2 text-white transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                          <Eye className="w-4 h-4" />
                          <span className="typography-caption">Découvrir les produits</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="typography-body text-gray-600 mb-4 line-clamp-2">{box.description}</p>
                    
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className={`typography-heading text-2xl font-bold text-orange-600 transition-all duration-300 ${
                        isHovered ? 'scale-110 text-orange-500' : ''
                      }`}>
                        {box.price} FCFA
                      </span>
                      <span className="typography-body text-gray-400 line-through">
                        {box.originalPrice} FCFA
                      </span>
                      <span className="typography-caption text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        /mois
                      </span>
                    </div>

                    {/* Benefits preview */}
                    <div className="space-y-1 mb-4">
                      {box.benefits.slice(0, 2).map((benefit, index) => (
                        <div key={index} className={`flex items-center gap-2 text-sm text-gray-600 transition-all duration-300 ${
                          isHovered ? 'translate-x-2' : ''
                        }`} style={{ transitionDelay: `${index * 50}ms` }}>
                          <Sparkles className={`w-3 h-3 text-orange-400 transition-all duration-300 ${
                            isHovered ? 'rotate-180 scale-125' : ''
                          }`} />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive button */}
                    <Button 
                      size="sm" 
                      className={`bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition-all duration-500 ${
                        isHovered ? 'scale-110 shadow-lg translate-y-1' : ''
                      }`}
                      onClick={() => handleAddToCart(box)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <ShoppingCart className="ml-2 h-4 w-4 animate-spin" />
                          Ajout...
                        </>
                      ) : (
                        <>
                          {isHovered ? 'Ajouter au panier' : 'Découvrir'}
                          <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`} />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Selected Box Details */}
        {selectedBox && (
          <div className="bg-gradient-to-r from-[#FFFDD0] to-[#FAF3E0] rounded-3xl p-8 mb-12 border border-[#F5F5DC] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="typography-display text-3xl font-bold mb-4 text-gray-800">
                  Votre {selectedBox.name}
                </h2>
                <p className="typography-body-large text-gray-700 mb-6">
                  {selectedBox.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedBox.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r from-[#FFFDD0] to-[#FAF3E0] rounded-full flex items-center justify-center`}>
                        <Star className="h-4 w-4 text-[#D2A679] fill-[#D2A679]" />
                      </div>
                      <span className="typography-body text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#FFFDD0] to-[#FAF3E0] text-gray-800 px-8 py-4 text-lg rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-[#F5F5DC] group"
                  onClick={() => handleAddToCart(selectedBox)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5 animate-spin text-[#D2A679]" />
                      Ajout au panier...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5 group-hover:animate-pulse text-[#D2A679]" />
                      Ajouter au panier
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform text-[#D2A679]" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {selectedBox.products.map((product, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-110"
                      />
                      <h4 className="typography-caption font-semibold text-gray-800 text-center line-clamp-2">
                        {product.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-orange-200 shadow-lg">
          <h2 className="typography-display text-2xl font-bold text-center mb-6 text-gray-800">
            Ce que contient votre Loumo Box
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform duration-300">
                  <Star className="h-6 w-6 text-white fill-white" />
                </div>
                <span className="typography-body text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#FFFDD0] to-[#FAF3E0] text-gray-800 px-12 py-6 text-xl rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border border-[#F5F5DC]"
          >
            <Heart className="mr-3 h-6 w-6 text-[#D2A679]" />
            Commencer mon abonnement Loumo Box
          </Button>
          <p className="typography-body text-gray-600 mt-6">
            Résiliable à tout moment • Premier mois satisfait ou remboursé
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Boxes;
