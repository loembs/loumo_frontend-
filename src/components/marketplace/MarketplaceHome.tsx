import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopList, ShopSearch, FeaturedShops } from './';
import { Shop } from '@/types/shop';
import { shopService } from '@/services/ShopService';
import { Button } from '@/components/ui/button';
import { Store, Star, Users, Globe } from 'lucide-react';

export const MarketplaceHome: React.FC = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalShops: 0,
    featuredShops: 0,
    totalProducts: 0,
    countries: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const totalShops = await shopService.getActiveShopsCount();
      const featuredShops = await shopService.getFeaturedShops();
      const allShops = await shopService.getAllShops();
      
      const totalProducts = allShops.reduce((sum, shop) => sum + shop.productCount, 0);
      const countries = new Set(allShops.map(shop => shop.country)).size;

      setStats({
        totalShops,
        featuredShops: featuredShops.length,
        totalProducts,
        countries
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleSearchResults = (searchResults: Shop[]) => {
    setShops(searchResults);
    setError(null);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Découvrez les Artisans Africains
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Explorez notre marketplace et connectez-vous avec des artisans talentueux 
            du continent africain. Des produits uniques et authentiques vous attendent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-orange-600 hover:text-orange-700"
              onClick={() => navigate('/create-shop')}
            >
              Créer ma boutique
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Store className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalShops}</div>
              <div className="text-sm text-gray-600">Boutiques actives</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.featuredShops}</div>
              <div className="text-sm text-gray-600">Boutiques mises en avant</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
              <div className="text-sm text-gray-600">Produits disponibles</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.countries}</div>
              <div className="text-sm text-gray-600">Pays représentés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutiques mises en avant */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Boutiques mises en avant</h2>
        <FeaturedShops />
      </div>

      {/* Recherche et liste des boutiques */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Toutes les boutiques</h2>
          <p className="text-gray-600 text-center">
            Découvrez notre sélection d'artisans africains et leurs créations uniques
          </p>
        </div>

        <ShopSearch 
          onSearchResults={handleSearchResults}
          onLoadingChange={handleLoadingChange}
        />

        <ShopList 
          shops={shops}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes artisan ?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'artisans africains et vendez vos créations 
            à des clients du monde entier. Créez votre boutique en quelques minutes !
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={() => navigate('/create-shop')}
          >
            Créer ma boutique maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};
