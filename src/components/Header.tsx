
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();

  // Nouvelle navigation simplifiée
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Loumo Box', href: '/boxes' },
    { name: 'Tutos', href: '/tutorials' },
    { name: 'À propos', href: '/about' }
  ];

  return (
    <header className="bg-[#F8F5EC]/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-[#F8F5EC]">
      {/* Top banner */}
      <div className="bg-[#D4A373] text-gray-700 py-2">
        <div className="container mx-auto px-4 text-center typography-caption">
          ✨ Sélection & Confection d’articles 100% made in Africa • Du Sénégal vers le Monde ✨
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className=" rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
              <img
                src="https://enfgjsucpmsmrqxencxz.supabase.co/storage/v1/object/public/menu//ChatGPT%20Image%2016%20juil.%202025,%2018_03_13.png"
                alt="Logo LOUMO"
                className="h-12 w-12 object-contain rounded-full"
                style={{ maxHeight: '3rem', maxWidth: '3rem' }}
              />
            </div>
            <div>
              <h1 className="typography-display text-2xl text-[#D4A373]">
                LOUMO
              </h1>
              <p className="typography-caption text-gray-600 -mt-1">Boubous • Bijoux • Prêt-à-porter</p>
            </div>
          </Link>

          {/* Search bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Rechercher un produit..."
                className="pl-10 pr-4 w-full border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm typography-body"
              />
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex space-x-6 items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Boutique</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col min-w-[180px] p-2">
                      <NavigationMenuLink asChild>
                        <Link to="/products?category=boubous" className="py-2 px-4 hover:bg-orange-50 rounded">Boubous</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/products?category=robes" className="py-2 px-4 hover:bg-orange-50 rounded">Robes</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/products?category=bijoux" className="py-2 px-4 hover:bg-orange-50 rounded">Bijoux</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/products?category=pret-a-porter" className="py-2 px-4 hover:bg-orange-50 rounded">Prêt-à-porter</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/products?category=accessoires" className="py-2 px-4 hover:bg-orange-50 rounded">Accessoires</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/products" className="py-2 px-4 hover:bg-orange-100 rounded font-semibold text-orange-600">Voir tout</Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className="typography-body text-gray-700 hover:text-orange-600 font-medium transition-colors relative group px-4 py-2"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right icons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-orange-50 hover:text-orange-600">
              <Heart className="h-5 w-5" />
            </Button>
            
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover:bg-orange-50 hover:text-orange-600">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative hover:bg-orange-50 hover:text-orange-600">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white typography-caption flex items-center justify-center border-2 border-white">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-orange-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 w-full border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm typography-body"
            />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-sm border-t border-orange-200">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="typography-body text-gray-700 hover:text-orange-600 font-medium py-3 px-4 rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
