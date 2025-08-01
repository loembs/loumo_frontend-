import React from 'react';
import { RefreshCw, Database, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CacheInfoProps {
  cacheInfo: {
    exists: boolean;
    isStale: boolean;
    age: number;
    productCount: number;
  };
  onRefresh: () => void;
  onClearCache: () => void;
  isLoading?: boolean;
}

const CacheInfo: React.FC<CacheInfoProps> = ({
  cacheInfo,
  onRefresh,
  onClearCache,
  isLoading = false
}) => {
  const formatAge = (age: number) => {
    const minutes = Math.floor(age / (1000 * 60));
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `Il y a ${hours}h ${minutes % 60}min`;
  };

  if (!cacheInfo.exists) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Database className="h-4 w-4" />
        <span>Aucun cache</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-blue-600" />
        <span className="text-gray-700">
          {cacheInfo.productCount} produits
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-orange-600" />
        <span className="text-gray-600">
          {formatAge(cacheInfo.age)}
        </span>
      </div>

      <Badge 
        variant={cacheInfo.isStale ? "destructive" : "default"}
        className="text-xs"
      >
        {cacheInfo.isStale ? 'Expiré' : 'Frais'}
      </Badge>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-6 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onClearCache}
          disabled={isLoading}
          className="h-6 px-2 text-red-600 hover:text-red-700"
        >
          <Package className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CacheInfo; 