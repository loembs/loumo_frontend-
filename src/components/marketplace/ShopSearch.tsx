import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { shopService } from '@/services/ShopService';
import { Shop } from '@/types/shop';

interface ShopSearchProps {
  onSearchResults: (shops: Shop[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const ShopSearch: React.FC<ShopSearchProps> = ({ onSearchResults, onLoadingChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isSearching, setIsSearching] = useState(false);

  const countries = [
    'Sénégal', 'Mali', 'Côte d\'Ivoire', 'Ghana', 'Nigeria', 
    'Cameroun', 'Gabon', 'Congo', 'Kenya', 'Tanzanie', 'Ouganda'
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim() && !country) {
      // Si pas de critères, charger toutes les boutiques
      await loadAllShops();
      return;
    }

    setIsSearching(true);
    onLoadingChange(true);

    try {
      let shops: Shop[] = [];

      if (searchTerm.trim()) {
        shops = await shopService.searchShops(searchTerm);
      } else {
        shops = await shopService.getAllShops();
      }

      // Filtrer par pays si sélectionné
      if (country) {
        shops = shops.filter(shop => shop.country === country);
      }

      // Trier les résultats
      shops = sortShops(shops, sortBy);

      onSearchResults(shops);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
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
      const shops = await shopService.getAllShops();
      const sortedShops = sortShops(shops, sortBy);
      onSearchResults(sortedShops);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
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
          return b.rating - a.rating;
        case 'sales':
          return b.totalSales - a.totalSales;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
              <SelectItem value="">Tous les pays</SelectItem>
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
