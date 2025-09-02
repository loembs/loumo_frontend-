import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopList, ShopSearch, FeaturedShops } from './';
import { Shop } from '@/types/shop';
import { shopService } from '@/services/ShopService';
import { Button } from '@/components/ui/button';
import { Store, Star, Users, Globe, ArrowLeft } from 'lucide-react';

// Données de démonstration pour les boutiques
const demoShops: Shop[] = [
  {
    id: 1,
    name: "Artisanat Traditionnel Sénégalais",
    slug: "artisanat-traditionnel-senegalais",
    description: "Découvrez nos créations artisanales authentiques du Sénégal, des bijoux traditionnels aux objets de décoration.",
    logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    bannerUrl: "",
    contactEmail: "contact@artisanat-senegal.com",
    contactPhone: "+221 77 123 45 67",
    address: "123 Rue de l'Artisanat",
    city: "Dakar",
    country: "Sénégal",
    status: "ACTIVE" as any,
    isVerified: true,
    isFeatured: true,
    rating: 4.8,
    totalReviews: 156,
    totalSales: 234,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    owner: {
      id: 1,
      email: "artisan@example.com",
      firstName: "Mamadou",
      lastName: "Diallo",
      role: "SHOP_OWNER"
    },
    productCount: 45,
    featuredProducts: []
  },
  {
    id: 2,
    name: "Bijoux Africains Élégance",
    slug: "bijoux-africains-elegance",
    description: "Collection exclusive de bijoux africains modernes et traditionnels, créés avec des matériaux nobles.",
    logoUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
    bannerUrl: "",
    contactEmail: "info@bijoux-africains.com",
    contactPhone: "+221 77 987 65 43",
    address: "456 Avenue des Bijoux",
    city: "Dakar",
    country: "Sénégal",
    status: "ACTIVE" as any,
    isVerified: true,
    isFeatured: false,
    rating: 4.9,
    totalReviews: 89,
    totalSales: 167,
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    owner: {
      id: 2,
      email: "bijoutier@example.com",
      firstName: "Fatou",
      lastName: "Ndiaye",
      role: "SHOP_OWNER"
    },
    productCount: 32,
    featuredProducts: []
  },
  {
    id: 3,
    name: "Mode Africaine Contemporaine",
    slug: "mode-africaine-contemporaine",
    description: "Vêtements modernes inspirés de la culture africaine, alliant tradition et contemporanéité.",
    logoUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop",
    bannerUrl: "",
    contactEmail: "contact@mode-africaine.com",
    contactPhone: "+221 77 555 44 33",
    address: "789 Boulevard de la Mode",
    city: "Dakar",
    country: "Sénégal",
    status: "ACTIVE" as any,
    isVerified: false,
    isFeatured: true,
    rating: 4.7,
    totalReviews: 203,
    totalSales: 445,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
    owner: {
      id: 3,
      email: "mode@example.com",
      firstName: "Aissatou",
      lastName: "Ba",
      role: "SHOP_OWNER"
    },
    productCount: 78,
    featuredProducts: []
  }
];

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
      setIsLoading(true);
      
      // Essayer d'abord l'API, puis utiliser les données de démonstration en fallback
      let totalShops = demoShops.length;
      let featuredShops = demoShops.filter(shop => shop.isFeatured);
      let allShops = demoShops;

      // Essayer de charger depuis l'API
      try {
        console.log('🔄 Tentative de chargement depuis l\'API...');
        const apiTotalShops = await shopService.getActiveShopsCount();
        totalShops = apiTotalShops;
        console.log('✅ Nombre de boutiques chargé depuis l\'API:', apiTotalShops);
      } catch (error) {
        console.log('⚠️ Impossible de charger le nombre de boutiques depuis l\'API, utilisation des données de démonstration');
        totalShops = demoShops.length;
      }

      try {
        const apiFeaturedShops = await shopService.getFeaturedShops();
        featuredShops = apiFeaturedShops;
        console.log('✅ Boutiques mises en avant chargées depuis l\'API:', apiFeaturedShops.length);
      } catch (error) {
        console.log('⚠️ Impossible de charger les boutiques mises en avant depuis l\'API, utilisation des données de démonstration');
        featuredShops = demoShops.filter(shop => shop.isFeatured);
      }

      try {
        const apiAllShops = await shopService.getAllShops();
        allShops = apiAllShops;
        setShops(apiAllShops);
        console.log('✅ Toutes les boutiques chargées depuis l\'API:', apiAllShops.length);
      } catch (error) {
        console.log('⚠️ Impossible de charger toutes les boutiques depuis l\'API, utilisation des données de démonstration');
        allShops = demoShops;
        setShops(demoShops);
      }
      
      const totalProducts = allShops.reduce((sum, shop) => sum + (shop.productCount || 0), 0);
      const countries = new Set(allShops.map(shop => shop.country)).size;

      setStats({
        totalShops,
        featuredShops: featuredShops.length,
        totalProducts,
        countries
      });
      
      console.log('📊 Statistiques finales:', {
        totalShops,
        featuredShops: featuredShops.length,
        totalProducts,
        countries
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      // Utiliser des valeurs par défaut en cas d'erreur totale
      setStats({
        totalShops: demoShops.length,
        featuredShops: demoShops.filter(shop => shop.isFeatured).length,
        totalProducts: demoShops.reduce((sum, shop) => sum + (shop.productCount || 0), 0),
        countries: new Set(demoShops.map(shop => shop.country)).size
      });
      setShops(demoShops);
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-b from-african-gold-600 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-amber-200 text-white py-16">
        <div className="container mx-auto px-4">
          {/* Bouton de retour à l'accueil */}
          <div className="mb-8">
            <Button 
              variant="outline"
              size="sm"
              className="border-white text-african-gold-600 hover:bg-white hover:text-orange-600"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-african-gold-600">
              Découvrez les Artisans Africains
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-black">
              Explorez notre marketplace et connectez-vous avec des artisans talentueux 
              du continent africain. Des produits uniques et authentiques vous attendent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-african-gold-600 hover:text-orange-700"
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
