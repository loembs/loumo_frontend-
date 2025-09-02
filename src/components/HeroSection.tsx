
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Store, ShoppingBag, Star, Users, TrendingUp, Plus, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/types/product';
import { ConnectionError } from '@/components/ConnectionError';

// Catégories génériques pour la marketplace
const categories = [
  { 
    name: 'Mode', 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop&crop=center&q=80',
    count: 0 
  },
  { 
    name: 'Artisanat', 
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop&crop=center&q=80',
    count: 0 
  },
  { 
    name: 'Bijoux', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop&crop=center&q=80',
    count: 0 
  },
  { 
    name: 'Accessoires', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop&crop=center&q=80',
    count: 0 
  },
  { 
    name: 'Décoration', 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop&crop=center&q=80',
    count: 0 
  },
  { 
    name: 'Beauté', 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop&crop=center&q=80',
    count: 0 
  }
];

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [categoriesWithCount, setCategoriesWithCount] = useState(categories);
  const [stats, setStats] = useState({
    creators: 0,
    products: 0,
    clients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Charger les produits vedettes
        const products = await ProductService.getProducts();
        const featured = products.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
        setFeaturedProducts(featured.length > 0 ? featured : products.slice(0, 4));

        // Charger les statistiques des boutiques (désactivé temporairement)
        // try {
        //   const shopsCount = await shopService.getActiveShopsCount();
        //   setStats(prev => ({ ...prev, creators: shopsCount }));
        // } catch (error) {
        //   console.log('Impossible de charger le nombre de boutiques:', error);
        // }
        
        // Utiliser des valeurs de démonstration pour les statistiques
        setStats(prev => ({ 
          ...prev, 
          creators: 25, // Valeur de démonstration
          products: products.length,
          clients: Math.floor(products.length * 2.5) // Estimation basée sur les produits
        }));

        // Calculer les statistiques des catégories
        const categoryCounts = categories.map(cat => {
          let count = 0;
          if (cat.name === 'Mode') {
            count = products.filter(p => {
              const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
              return categoryName?.toLowerCase().includes('boubou') || 
                     categoryName?.toLowerCase().includes('robe') ||
                     categoryName?.toLowerCase().includes('mode') ||
                     categoryName?.toLowerCase().includes('vetement');
            }).length;
          } else if (cat.name === 'Artisanat') {
            count = products.filter(p => {
              const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
              return categoryName?.toLowerCase().includes('artisanat') || 
                     categoryName?.toLowerCase().includes('traditionnel') ||
                     categoryName?.toLowerCase().includes('main');
            }).length;
          } else {
            count = products.filter(p => {
              const categoryName = typeof p.category === 'string' ? p.category : p.category?.name;
              return categoryName?.toLowerCase().includes(cat.name.toLowerCase());
            }).length;
          }
          return { ...cat, count };
        });
        setCategoriesWithCount(categoryCounts);

        // Mettre à jour les statistiques
        setStats(prev => ({ 
          ...prev, 
          products: products.length,
          clients: Math.floor(products.length * 2.5) // Estimation basée sur les produits
        }));

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erreur lors du chargement des données');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentProductIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const currentProduct = featuredProducts[currentProductIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5EC] via-[#FAF9F6] to-[#FDFBF6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-african-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5EC] via-[#FAF9F6] to-[#FDFBF6]">
      {/* Affichage des erreurs de connexion */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <ConnectionError 
            error={error} 
            onRetry={() => {
              setError(null);
              setLoading(true);
              // Recharger les données
              const loadData = async () => {
                try {
                  const products = await ProductService.getProducts();
                  const featured = products.filter(p => p.isBestSeller || p.isNew).slice(0, 4);
                  setFeaturedProducts(featured.length > 0 ? featured : products.slice(0, 4));
                  setStats(prev => ({ 
                    ...prev, 
                    creators: 25,
                    products: products.length,
                    clients: Math.floor(products.length * 2.5)
                  }));
                  setError(null);
                } catch (error) {
                  if (error instanceof Error) {
                    setError(error.message);
                  } else {
                    setError('Erreur lors du chargement des données');
                  }
                } finally {
                  setLoading(false);
                }
              };
              loadData();
            }}
          />
        </div>
      )}

      {/* Header Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-african-gold-200 to-african-gold-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-african-green-200 to-african-green-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-african-gold-100 to-african-gold-200 rounded-full opacity-20 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh] py-12">
            {/* Left content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
                {/* <Sparkles className="w-6 h-6 text-african-gold-500" /> */}
                <span className="typography-subheading text-african-gold-600">Marketplace Africaine • Mode & Artisanat</span>
              </div>

              <h1 className="typography-hero text-4xl lg:text-6xl text-gray-800 mb-6 text-shadow-soft">
                <span className="text-[#D4A373]">Marketplace</span> Africaine
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Découvrez l'artisanat africain authentique. Une communauté de créateurs passionnés qui partagent leur savoir-faire et leur culture à travers des créations uniques.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-african-gold-500 to-african-gold-600 hover:from-african-gold-600 hover:to-african-gold-700 text-white typography-body font-semibold px-8"
                  asChild
                >
                  <Link to="/marketplace">
                    Explorer la marketplace
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-african-gold-300 text-african-gold-700 hover:bg-african-gold-50 typography-body"
                  asChild
                >
                  <Link to="/create-shop">
                    <Store className="mr-2 w-5 h-5" />
                    Créer ma boutique
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-african-gold-600">{stats.creators}+</div>
                  <div className="text-sm text-gray-600">Créateurs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-african-gold-600">{stats.products}+</div>
                  <div className="text-sm text-gray-600">Produits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-african-gold-600">{stats.clients}+</div>
                  <div className="text-sm text-gray-600">Clients</div>
                </div>
              </div>
            </div>

            {/* Right content - Featured Product Showcase */}
            <div className="relative animate-slide-up">
              <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-african-gold-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Produit Vedette</h3>
                  <p className="text-gray-600">Découvrez nos créations les plus populaires</p>
                </div>
                
                {currentProduct && (
                  <div className="relative aspect-square bg-gradient-to-br from-african-gold-50 to-african-gold-100 rounded-2xl overflow-hidden">
                    <img 
                      src={currentProduct.imageUrl}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-semibold text-lg">{currentProduct.name}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{currentProduct.rating || 4.5}</span>
                          <span className="text-sm opacity-75">({currentProduct.reviewCount || 0})</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{currentProduct.price.toLocaleString()} FCFA</div>
                          {currentProduct.originalPrice && (
                            <div className="text-sm line-through opacity-75">
                              {currentProduct.originalPrice.toLocaleString()} FCFA
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {currentProduct.isNew && (
                      <Badge className="absolute top-4 left-4 bg-green-500">Nouveau</Badge>
                    )}
                    {currentProduct.isBestSeller && (
                      <Badge className="absolute top-4 left-4 bg-orange-500">Best Seller</Badge>
                    )}
                  </div>
                )}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-african-gold-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-african-green-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-orange-800 to-amber-800 bg-clip-text text-transparent">
              Explorez nos univers créatifs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez la diversité de l'artisanat africain, des savoir-faire traditionnels aux créations contemporaines.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categoriesWithCount.map((category, index) => (
              <div 
                key={index} 
                className="group relative cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Overlay content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-wide">{category.name}</h3>
                        <p className="text-sm opacity-90 font-medium">{category.count} créations</p>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      </div>
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="text-xs font-semibold text-gray-800">Explorer</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
              </div>
            ))}
          </div>
          
          {/* Call to action */}
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 px-8 py-3 text-lg font-semibold"
              asChild
            >
              <Link to="/marketplace">
                Découvrir toutes les catégories
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Create Shop Section */}
      <section className="py-16 bg-gradient-to-r from-african-gold-50 to-african-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="w-20 h-20 bg-gradient-to-r from-african-gold-400 to-african-gold-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Store className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Vous êtes artisan ou créateur ? Rejoignez notre communauté !
              </h2>
              
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Partagez votre savoir-faire et vos créations uniques avec une communauté passionnée. 
                Rejoignez des centaines d'artisans qui font rayonner la richesse culturelle africaine.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-african-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-african-gold-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Création simple</h3>
                  <p className="text-sm text-gray-600">Créez votre boutique en quelques minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-african-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-african-gold-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Croissance garantie</h3>
                  <p className="text-sm text-gray-600">Accédez à une large communauté d'acheteurs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-african-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-african-gold-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Support dédié</h3>
                  <p className="text-sm text-gray-600">Accompagnement personnalisé</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-african-gold-500 to-african-gold-600 hover:from-african-gold-600 hover:to-african-gold-700 text-white font-semibold px-8"
                asChild
              >
                <Link to="/create-shop">
                  <Store className="mr-2 w-5 h-5" />
                  Créer ma boutique maintenant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Créations populaires</h2>
            <p className="text-gray-600">Découvrez les œuvres les plus appréciées de notre communauté d'artisans</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                    
                    {product.isNew && (
                      <Badge className="absolute top-3 left-3 bg-green-500">Nouveau</Badge>
                    )}
                    {product.isBestSeller && (
                      <Badge className="absolute top-3 left-3 bg-orange-500">Best Seller</Badge>
                    )}
                    
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="rounded-full w-8 h-8 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-african-gold-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                      <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-800">{product.price.toLocaleString()} FCFA</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {product.originalPrice.toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                      
                      <Button size="sm" className="bg-african-gold-500 hover:bg-african-gold-600">
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="border-african-gold-300 text-african-gold-700 hover:bg-african-gold-50"
              asChild
            >
              <Link to="/marketplace">
                Découvrir toutes les créations
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
