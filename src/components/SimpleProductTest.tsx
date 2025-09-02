import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SimpleProductTest: React.FC = () => {
  const { products, isLoading, error, loadProducts } = useProducts();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test Simple des Produits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={loadProducts} disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Recharger'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Erreur: {error}</p>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Produits chargés: {products.length}</h3>
          {products.length > 0 && (
            <div className="space-y-2">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="p-2 border rounded">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.price} FCFA</p>
                </div>
              ))}
              {products.length > 3 && (
                <p className="text-sm text-gray-500">... et {products.length - 3} autres</p>
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>État: {isLoading ? 'Chargement' : 'Prêt'}</p>
          <p>URL API: https://back-lomou.onrender.com/api/product</p>
        </div>
      </CardContent>
    </Card>
  );
};
