import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Star, 
  StarOff, 
  Eye, 
  EyeOff,
  Store,
  Clock,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { Shop } from '@/types/shop';
import { shopService } from '@/services/ShopService';
import { useToast } from '@/hooks/use-toast';

interface ShopManagementProps {
  className?: string;
}

export const ShopManagement: React.FC<ShopManagementProps> = ({ className }) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    pendingShops: 0,
    suspendedShops: 0,
    featuredShops: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    loadShops();
    loadStats();
  }, []);

  const loadShops = async () => {
    try {
      setIsLoading(true);
      const allShops = await shopService.getAllShopsForAdmin();
      setShops(allShops);
      setError(null);
    } catch (error) {
      setError('Erreur lors du chargement des boutiques');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const shopStats = await shopService.getAdminShopStats();
      setStats(shopStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleValidateShop = async (shopId: number) => {
    try {
      await shopService.validateShop(shopId);
      toast({
        title: "✅ Boutique validée",
        description: "La boutique a été validée avec succès. Un email a été envoyé au propriétaire.",
      });
      loadShops();
      loadStats();
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de valider la boutique",
        variant: "destructive",
      });
    }
  };

  const handleRejectShop = async (shopId: number) => {
    try {
      await shopService.rejectShop(shopId, rejectionReason);
      toast({
        title: "⚠️ Boutique rejetée",
        description: "La boutique a été rejetée. Un email a été envoyé au propriétaire.",
      });
      setShowRejectDialog(false);
      setRejectionReason('');
      loadShops();
      loadStats();
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de rejeter la boutique",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShop = async (shopId: number) => {
    try {
      await shopService.deleteShop(shopId);
      toast({
        title: "🗑️ Boutique supprimée",
        description: "La boutique a été supprimée définitivement.",
      });
      setShowDeleteDialog(false);
      loadShops();
      loadStats();
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer la boutique",
        variant: "destructive",
      });
    }
  };

  const handleToggleFeatured = async (shopId: number, currentFeatured: boolean) => {
    try {
      await shopService.toggleFeaturedShop(shopId, !currentFeatured);
      toast({
        title: currentFeatured ? "⭐ Retiré de la mise en avant" : "⭐ Mis en avant",
        description: `La boutique a été ${currentFeatured ? 'retirée de' : 'mise en'} avant.`,
      });
      loadShops();
      loadStats();
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier la mise en avant",
        variant: "destructive",
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'SUSPENDED':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Store className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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

  return (
    <div className={className}>
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalShops}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeShops}</div>
            <div className="text-sm text-gray-600">Actives</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingShops}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.suspendedShops}</div>
            <div className="text-sm text-gray-600">Suspendues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.featuredShops}</div>
            <div className="text-sm text-gray-600">Mises en avant</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des boutiques */}
      <div className="space-y-4">
        {shops.map((shop) => (
          <Card key={shop.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(shop.status)}
                    <h3 className="text-lg font-semibold">{shop.name}</h3>
                    {getStatusBadge(shop.status)}
                    {shop.isFeatured && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Star className="h-3 w-3 mr-1" />
                        Mise en avant
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{shop.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Propriétaire:</span> {shop.owner?.firstName} {shop.owner?.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {shop.contactEmail}
                    </div>
                    <div>
                      <span className="font-medium">Ville:</span> {shop.city}, {shop.country}
                    </div>
                    <div>
                      <span className="font-medium">Note:</span> {shop.rating || 0}/5 ({shop.totalReviews || 0} avis)
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {shop.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleValidateShop(shop.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Valider
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedShop(shop);
                          setShowRejectDialog(true);
                        }}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(shop.id, shop.isFeatured)}
                    className={shop.isFeatured ? "border-yellow-300 text-yellow-600" : "border-gray-300"}
                  >
                    {shop.isFeatured ? (
                      <>
                        <StarOff className="h-4 w-4 mr-2" />
                        Retirer
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Mettre en avant
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedShop(shop);
                      setShowDeleteDialog(true);
                    }}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la boutique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir rejeter la boutique "{selectedShop?.name}" ?
            </p>
            <div>
              <label className="block text-sm font-medium mb-2">Raison du rejet (optionnel)</label>
              <Textarea
                placeholder="Expliquez pourquoi cette boutique est rejetée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => selectedShop && handleRejectShop(selectedShop.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Rejeter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la boutique</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              ⚠️ Êtes-vous sûr de vouloir supprimer définitivement la boutique "{selectedShop?.name}" ?
              <br />
              <strong>Cette action est irréversible !</strong>
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => selectedShop && handleDeleteShop(selectedShop.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer définitivement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

