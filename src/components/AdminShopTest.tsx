import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { shopService } from '@/services/ShopService';
import { Shop } from '@/types/shop';
import { ENDPOINTS } from '@/config/constants';

export const AdminShopTest: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllShops = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Essayer d'abord l'API admin
      try {
        const allShops = await shopService.getAllShopsForAdmin();
        setShops(allShops);
        console.log('✅ Boutiques chargées depuis l\'API admin:', allShops.length);
      } catch (error) {
        console.log('⚠️ Impossible de charger depuis l\'API admin, essai API normale');
        
        // Fallback vers l'API normale
        const normalShops = await shopService.getAllShops();
        setShops(normalShops);
        console.log('✅ Boutiques chargées depuis l\'API normale:', normalShops.length);
      }
      
    } catch (error) {
      setError('Erreur lors du chargement des boutiques');
      console.error('❌ Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testValidateShop = async (shopId: number) => {
    try {
      await shopService.validateShop(shopId);
      console.log('✅ Boutique validée:', shopId);
      loadAllShops(); // Recharger la liste
    } catch (error) {
      console.error('❌ Erreur validation:', error);
    }
  };

  const testRejectShop = async (shopId: number) => {
    try {
      await shopService.rejectShop(shopId, 'Test de rejet');
      console.log('✅ Boutique rejetée:', shopId);
      loadAllShops(); // Recharger la liste
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
    }
  };

  const testDeleteShop = async (shopId: number) => {
    try {
      await shopService.deleteShop(shopId);
      console.log('✅ Boutique supprimée:', shopId);
      loadAllShops(); // Recharger la liste
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'SUSPENDED':
        return <Badge className="bg-red-100 text-red-800">Suspendue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Test Admin - Gestion des Boutiques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={loadAllShops} disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Charger toutes les boutiques'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Erreur: {error}</p>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Boutiques chargées: {shops.length}</h3>
          
          {shops.length > 0 && (
            <div className="space-y-3">
              {shops.map((shop) => (
                <div key={shop.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{shop.name}</h4>
                      {getStatusBadge(shop.status)}
                      {shop.isFeatured && (
                        <Badge className="bg-purple-100 text-purple-800">⭐ Mise en avant</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {shop.id} | Propriétaire: {shop.owner?.firstName} {shop.owner?.lastName}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{shop.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                    <div><span className="font-medium">Email:</span> {shop.contactEmail}</div>
                    <div><span className="font-medium">Téléphone:</span> {shop.contactPhone}</div>
                    <div><span className="font-medium">Ville:</span> {shop.city}, {shop.country}</div>
                    <div><span className="font-medium">Note:</span> {shop.rating || 0}/5</div>
                  </div>

                  <div className="flex gap-2">
                    {shop.status === 'PENDING' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => testValidateShop(shop.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✅ Valider
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => testRejectShop(shop.id)}
                          className="border-red-300 text-red-600"
                        >
                          ❌ Rejeter
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => testDeleteShop(shop.id)}
                      className="border-red-300 text-red-600"
                    >
                      🗑️ Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>État: {isLoading ? 'Chargement' : 'Prêt'}</p>
          <p>URL API Admin: https://back-lomou.onrender.com/api/admin/shops</p>
          <p>URL API Normale: https://back-lomou.onrender.com/api/shops</p>
        </div>
      </CardContent>
    </Card>
  );
};
