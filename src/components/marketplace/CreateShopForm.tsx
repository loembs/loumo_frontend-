import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { shopService } from '@/services/ShopService';
import { CreateShopRequest } from '@/types/shop';
import { Store, Upload, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CreateShopForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateShopRequest>({
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    country: '',
    logoUrl: '',
    bannerUrl: ''
  });

  const countries = [
    'Sénégal', 'Mali', 'Côte d\'Ivoire', 'Ghana', 'Nigeria', 
    'Cameroun', 'Gabon', 'Congo', 'Kenya', 'Tanzanie', 'Ouganda'
  ];

  const handleInputChange = (field: keyof CreateShopRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await shopService.createShop(formData);
      toast({
        title: "Succès !",
        description: "Votre boutique a été créée avec succès.",
      });
      navigate('/marketplace');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre boutique.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la marketplace
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer votre boutique
            </h1>
            <p className="text-gray-600">
              Rejoignez notre communauté d'artisans africains
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Informations de votre boutique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom de la boutique */}
              <div>
                <Label htmlFor="name">Nom de la boutique *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Artisanat Traditionnel"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre boutique et vos produits..."
                  rows={4}
                  required
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="contact@votreboutique.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Téléphone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+221 77 123 45 67"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Rue de l'Artisanat"
                  required
                />
              </div>

              {/* Ville et Pays */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Dakar"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Pays *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Images (optionnel) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoUrl">URL du logo</Label>
                  <div className="relative">
                    <Input
                      id="logoUrl"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bannerUrl">URL de la bannière</Label>
                  <div className="relative">
                    <Input
                      id="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={(e) => handleInputChange('bannerUrl', e.target.value)}
                      placeholder="https://example.com/banner.png"
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/marketplace')}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    'Créer ma boutique'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
