import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShoppingBag, CheckCircle } from 'lucide-react';
import { Shop } from '@/types/shop';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ShopCardProps {
  shop: Shop;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  // Valeurs par défaut pour éviter les erreurs
  const rating = shop.rating || 0;
  const totalReviews = shop.totalReviews || 0;
  const productCount = shop.productCount || 0;
  const totalSales = shop.totalSales || 0;
  const isVerified = shop.isVerified || false;
  const isFeatured = shop.isFeatured || false;
  const city = shop.city || 'Ville inconnue';
  const country = shop.country || 'Pays inconnu';
  const description = shop.description || 'Aucune description disponible';
  const name = shop.name || 'Boutique sans nom';

  return (
    <Link to={`/shop/${shop.slug || shop.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg truncate group-hover:text-orange-600 transition-colors">
                  {name}
                </h3>
                {isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{city}, {country}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({totalReviews})</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <ShoppingBag className="h-3 w-3" />
              <span>{productCount} produits</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {isFeatured && (
              <Badge variant="secondary" className="text-xs">
                Mis en avant
              </Badge>
            )}
            {isVerified && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Vérifié
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {totalSales} ventes
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
