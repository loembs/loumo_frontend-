
import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string | { id: string; name: string };
  skinType?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  imageUrl,
  category,
  skinType,
  isNew,
  isBestSeller,
  description
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, isLoading } = useCart();

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    await addItem({
      item: {
        id,
        name,
        price,
        image: imageUrl,
        origin: 'Sénégal',
        category: typeof category === 'string' ? category : category?.name || '',
        available: true
      },
      quantity: 1
    });
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-african-gold-100 hover:border-african-gold-300 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Product image */}
        <div className="aspect-square bg-gradient-to-br from-african-gold-50 to-african-earth-50 relative">
          <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                      src={imageUrl} 
                      alt={name}
                      className="object-cover w-full h-full"
                  />
          </div>
          {/* Overlay buttons */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center space-x-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
              <Eye className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              className="bg-african-gold-500 hover:bg-african-gold-600"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {isNew && (
            <Badge className="bg-african-green-500 hover:bg-african-green-600 text-white">
              Nouveau
            </Badge>
          )}
          {isBestSeller && (
            <Badge className="bg-african-terracotta-500 hover:bg-african-terracotta-600 text-white">
              Bestseller
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/80 hover:bg-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-african-earth-600'}`} 
          />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <p className="text-sm text-orange-600 font-medium mb-1">
          {typeof category === 'string' ? category : category?.name}
        </p>

        {/* Product name */}
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-african-earth-500 mb-3 line-clamp-2">
          {description}
        </p>
        {/* Skin type tags */}
        {skinType && skinType.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skinType.map((type) => (
              <Badge 
                key={type} 
                variant="outline" 
                className="text-xs border-african-gold-200 text-african-gold-700"
              >
                {type}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? 'fill-african-gold-400 text-african-gold-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-african-earth-600">
            {rating} ({reviewCount} avis)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-african-earth-800">
              {price}FCFA
            </span>
            {originalPrice && (
              <span className="text-sm text-african-earth-400 line-through">
                {originalPrice}FCFA
              </span>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="bg-african-gold-500 hover:bg-african-gold-600 text-white"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
