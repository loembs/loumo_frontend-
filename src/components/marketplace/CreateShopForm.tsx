import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { shopService } from '@/services/ShopService';
import { CreateShopRequest } from '@/types/shop';
import { Store, Upload, ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
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

  // États pour les fichiers uploadés
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (file: File, type: 'logo' | 'banner') => {
    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image (JPEG, PNG ou WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5MB",
        variant: "destructive",
      });
      return;
    }

    // Créer l'aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(preview);
        setFormData(prev => ({ ...prev, logoUrl: preview }));
      } else {
        setBannerFile(file);
        setBannerPreview(preview);
        setFormData(prev => ({ ...prev, bannerUrl: preview }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogoFile(null);
      setLogoPreview('');
      setFormData(prev => ({ ...prev, logoUrl: '' }));
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else {
      setBannerFile(null);
      setBannerPreview('');
      setFormData(prev => ({ ...prev, bannerUrl: '' }));
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ici, vous pourriez ajouter la logique pour uploader les fichiers
      // vers votre service de stockage (Supabase, AWS S3, etc.)
      // Pour l'instant, on utilise les URLs de preview
      
      await shopService.createShop(formData);
      toast({
        title: "Succès !",
        description: "Votre boutique a été créée avec succès.",
      });
      navigate('/marketplace');
    } catch (error) {
      // Gestion spécifique des erreurs d'authentification
      if (error instanceof Error && error.message === 'Authentification requise') {
        // L'erreur d'authentification est déjà gérée par le hook useAuthError
        // Pas besoin de faire quoi que ce soit ici
        return;
      }
      
      // Pour les autres erreurs
      console.error('❌ Erreur lors de la création de la boutique:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de votre boutique.",
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

              {/* Upload Logo */}
              <div>
                <Label>Logo de votre boutique</Label>
                <div className="mt-2">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                        onClick={() => removeFile('logo')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'logo');
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => logoInputRef.current?.click()}
                        className="mb-2"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir un logo
                      </Button>
                      <p className="text-sm text-gray-500">
                        PNG, JPG ou WebP • Max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Bannière */}
              <div>
                <Label>Bannière de votre boutique</Label>
                <div className="mt-2">
                  {bannerPreview ? (
                    <div className="relative inline-block">
                      <img 
                        src={bannerPreview} 
                        alt="Banner preview" 
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                        onClick={() => removeFile('banner')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'banner');
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => bannerInputRef.current?.click()}
                        className="mb-2"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir une bannière
                      </Button>
                      <p className="text-sm text-gray-500">
                        PNG, JPG ou WebP • Max 5MB • Format paysage recommandé
                      </p>
                    </div>
                  )}
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
