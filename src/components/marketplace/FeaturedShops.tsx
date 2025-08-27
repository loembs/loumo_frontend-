import React, { useState, useEffect } from 'react';
import { ShopCard } from './ShopCard';
import { Shop } from '@/types/shop';
import { shopService } from '@/services/ShopService';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      const shops = await shopService.getFeaturedShops();
      setFeaturedShops(shops);
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques mises en avant:', error);
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
        <p className="text-gray-500">Aucune boutique mise en avant pour le moment.</p>
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
