import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { shopService } from '@/services/ShopService';
import { Shop } from '@/types/shop';

// Données de démonstration pour toutes les boutiques
const demoAllShops: Shop[] = [
  {
    id: 1,
    name: "Artisanat Traditionnel Sénégalais",
    slug: "artisanat-traditionnel-senegalais",
    description: "Découvrez nos créations artisanales authentiques du Sénégal, des bijoux traditionnels aux objets de décoration.",
    logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    bannerUrl: "",
    contactEmail: "contact@artisanat-senegal.com",
    contactPhone: "+221 77 123 45 67",
    address: "123 Rue de l'Artisanat",
    city: "Dakar",
    country: "Sénégal",
    status: "ACTIVE" as any,
    isVerified: true,
    isFeatured: true,
    rating: 4.8,
    totalReviews: 156,
    totalSales: 234,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    owner: {
      id: 1,
      email: "artisan@example.com",
      firstName: "Mamadou",
      lastName: "Diallo",
      role: "SHOP_OWNER"
    },
    productCount: 45,
    featuredProducts: []
  },
  {
    id: 2,
    name: "Bijoux Africains Élégance",
    slug: "bijoux-africains-elegance",
    description: "Collection exclusive de bijoux africains modernes et traditionnels, créés avec des matériaux nobles.",
    logoUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
    bannerUrl: "",
    contactEmail: "info@bijoux-africains.com",
    contactPhone: "+221 77 987 65 43",
    address: "456 Avenue des Bijoux",
    city: "Dakar",
    country: "Sénégal",
    status: "ACTIVE" as any,
    isVerified: true,
    isFeatured: false,
    rating: 4.9,
    totalReviews: 89,
    totalSales: 167,
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    owner: {
      id: 2,
      email: "bijoutier@example.com",
      firstName: "Fatou",
      lastName: "Ndiaye",
      role: "SHOP_OWNER"
    },
    productCount: 32,
    featuredProducts: []
  },
  {
    id: 3,
    name: "Mode Africaine Contemporaine",
    slug: "mode-africaine-contemporaine",
    description: "Vêtements modernes inspirés de la culture africaine, alliant tradition et contemporanéité.",
    logoUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop",
    bannerUrl: "",
    contactEmail: "contact@mode-africaine.com",
    contactPhone: "+221 77 555 44 33",
    address: "789 Boulevard de la Mode",
    city: "Dakar",
    country: "Sénégal",
    status: "ACTIVE" as any,
    isVerified: false,
    isFeatured: true,
    rating: 4.7,
    totalReviews: 203,
    totalSales: 445,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
    owner: {
      id: 3,
      email: "mode@example.com",
      firstName: "Aissatou",
      lastName: "Ba",
      role: "SHOP_OWNER"
    },
    productCount: 78,
    featuredProducts: []
  }
];

interface ShopSearchProps {
  onSearchResults: (shops: Shop[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const ShopSearch: React.FC<ShopSearchProps> = ({ onSearchResults, onLoadingChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isSearching, setIsSearching] = useState(false);

  const countries = [
    'Sénégal', 'Mali', 'Côte d\'Ivoire', 'Ghana', 'Nigeria', 
    'Cameroun', 'Gabon', 'Congo', 'Kenya', 'Tanzanie', 'Ouganda'
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim() && (!country || country === 'all')) {
      // Si pas de critères, charger toutes les boutiques
      await loadAllShops();
      return;
    }

    setIsSearching(true);
    onLoadingChange(true);

    try {
      let shops: Shop[] = [];

      // Essayer d'abord l'API, puis utiliser les données de démonstration en fallback
      if (searchTerm.trim()) {
        try {
          console.log('🔄 Recherche de boutiques via API...');
          shops = await shopService.searchShops(searchTerm);
          console.log('✅ Recherche API réussie:', shops.length, 'résultats');
        } catch (error) {
          console.log('⚠️ Recherche API échouée, utilisation de toutes les boutiques pour filtrage local');
          try {
            shops = await shopService.getAllShops();
          } catch (error2) {
            console.log('⚠️ Impossible de charger toutes les boutiques depuis l\'API, utilisation des données de démonstration');
            shops = demoAllShops;
          }
        }
      } else {
        try {
          console.log('🔄 Chargement de toutes les boutiques via API...');
          shops = await shopService.getAllShops();
          console.log('✅ Chargement API réussi:', shops.length, 'boutiques');
        } catch (error) {
          console.log('⚠️ Impossible de charger toutes les boutiques depuis l\'API, utilisation des données de démonstration');
          shops = demoAllShops;
        }
      }

      // Recherche locale si nécessaire
      if (searchTerm.trim() && shops === demoAllShops) {
        shops = shops.filter(shop => 
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log('🔍 Recherche locale effectuée:', shops.length, 'résultats');
      }

      // Filtrer par pays si sélectionné
      if (country && country !== 'all') {
        shops = shops.filter(shop => shop.country === country);
      }

      // Trier les résultats
      shops = sortShops(shops, sortBy);

      onSearchResults(shops);
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
      onLoadingChange(false);
    }
  };

  const loadAllShops = async () => {
    setIsSearching(true);
    onLoadingChange(true);

    try {
      let shops: Shop[] = [];
      
      try {
        console.log('🔄 Chargement de toutes les boutiques via API...');
        shops = await shopService.getAllShops();
        console.log('✅ Chargement API réussi:', shops.length, 'boutiques');
      } catch (error) {
        console.log('⚠️ Impossible de charger toutes les boutiques depuis l\'API, utilisation des données de démonstration');
        shops = demoAllShops;
      }
      
      const sortedShops = sortShops(shops, sortBy);
      onSearchResults(sortedShops);
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
      onLoadingChange(false);
    }
  };

  const sortShops = (shops: Shop[], sortBy: string): Shop[] => {
    return [...shops].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'sales':
          return (b.totalSales || 0) - (a.totalSales || 0);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    // Charger toutes les boutiques au montage
    loadAllShops();
  }, []);

  useEffect(() => {
    // Recharger quand le tri change
    if (!isSearching) {
      handleSearch();
    }
  }, [sortBy]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Recherche par nom */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher une boutique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Filtre par pays */}
        <div className="lg:w-48">
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {countries.map((countryName) => (
                <SelectItem key={countryName} value={countryName}>
                  {countryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tri */}
        <div className="lg:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="rating">Note</SelectItem>
              <SelectItem value="sales">Ventes</SelectItem>
              <SelectItem value="newest">Plus récent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton de recherche */}
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="lg:w-auto"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Recherche...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
