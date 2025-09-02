import React, { useState, useEffect } from 'react';
import { ShopCard } from './ShopCard';
import { Shop } from '@/types/shop';
import { shopService } from '@/services/ShopService';
import { Loader2, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Données de démonstration pour les boutiques mises en avant
const demoFeaturedShops: Shop[] = [
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

export const FeaturedShops: React.FC = () => {
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadFeaturedShops();
  }, []);

  const loadFeaturedShops = async () => {
    try {
      setIsLoading(true);
      
      // Essayer d'abord l'API, puis utiliser les données de démonstration en fallback
      try {
        console.log('🔄 Tentative de chargement des boutiques mises en avant depuis l\'API...');
        const shops = await shopService.getFeaturedShops();
        setFeaturedShops(shops);
        console.log('✅ Boutiques mises en avant chargées depuis l\'API:', shops.length);
      } catch (error) {
        console.log('⚠️ Impossible de charger les boutiques mises en avant depuis l\'API, utilisation des données de démonstration');
        setFeaturedShops(demoFeaturedShops);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des boutiques mises en avant:', error);
      setFeaturedShops(demoFeaturedShops);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= featuredShops.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? Math.max(0, featuredShops.length - 3) : prevIndex - 3
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Chargement des boutiques mises en avant...</span>
      </div>
    );
  }

  if (featuredShops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg p-8 shadow-sm max-w-md mx-auto">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune boutique mise en avant</h3>
          <p className="text-gray-500 mb-4">
            Les boutiques mises en avant apparaîtront ici. Revenez bientôt !
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            Actualiser
          </Button>
        </div>
      </div>
    );
  }

  const visibleShops = featuredShops.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative">
      {/* Boutons de navigation */}
      {featuredShops.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Grille des boutiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {visibleShops.map((shop) => (
          <div key={shop.id} className="transform transition-transform duration-300 hover:scale-105">
            <ShopCard shop={shop} />
          </div>
        ))}
      </div>

      {/* Indicateurs de pagination */}
      {featuredShops.length > 3 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(featuredShops.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === Math.floor(currentIndex / 3)
                  ? 'bg-orange-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
