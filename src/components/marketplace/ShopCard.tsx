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
  return (
    <Link to={`/shop/${shop.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
              {shop.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg truncate group-hover:text-orange-600 transition-colors">
                  {shop.name}
                </h3>
                {shop.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{shop.city}, {shop.country}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {shop.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{shop.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({shop.totalReviews})</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <ShoppingBag className="h-3 w-3" />
              <span>{shop.productCount} produits</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {shop.isFeatured && (
              <Badge variant="secondary" className="text-xs">
                Mis en avant
              </Badge>
            )}
            {shop.isVerified && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Vérifié
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {shop.totalSales} ventes
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
