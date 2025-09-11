import React,{ useState, useEffect } from 'react';
import { ShopCard } from './ShopCard';
import { Shop } from '@/types/shop';
import { Loader2 } from 'lucide-react';
import { shopService } from '@/services/ShopService';
import { Button } from '@/components/ui/button';

interface ShopListProps {
  shops: Shop[];
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export const ShopList: React.FC<ShopListProps> = ({ className }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setIsLoading(true);
      const allShops = await shopService.getAllShops();
      setShops(allShops);
      setError(null);
    } catch (error) {
      setError('Erreur lors du chargement des boutiques');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Chargement des boutiques...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadShops}>Réessayer</Button>
      </div>
    );
  }

  if (shops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune boutique trouvée</h3>
        <p className="text-gray-500">Il n'y a pas encore de boutiques disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
};
