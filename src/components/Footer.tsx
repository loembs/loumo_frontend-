
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  Leaf,
  Shield,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateAdminForm from './CreateAdminForm';

const Footer = () => {
  return (
    <footer className="bg-[#D4A373] text-white *:text-white">
      {/* Newsletter section */}
      <div className="bg-gradient-to-r from-[#FFFDD0] to-[#FDF6E3] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h3 className="text-2xl font-bold mb-4 text-black">
              Restez connectée à la beauté africaine
            </h3>
            <p className="mb-6 text-black">
              Recevez nos conseils beauté, nos nouveautés et offres exclusives
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="bg-[#FFFFF0] text-black border-none placeholder-white"
              />
              <Button className="bg-[#F5F5DC] hover:bg-[#FAF3E0] text-[#D4A373] whitespace-nowrap">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <img
                  src="https://enfgjsucpmsmrqxencxz.supabase.co/storage/v1/object/public/menu//ChatGPT%20Image%2016%20juil.%202025,%2018_03_13.png"
                  alt="Logo LOUMO"
                  className="h-12 w-12 object-contain rounded-full"
                  style={{ maxHeight: '3rem', maxWidth: '3rem' }}
                />
                <div>
                  <h2 className="text-xl font-bold">LOUMO</h2>
                  <p className="text-african-gold-300 text-sm" style={{ color: '#fff' }}>Boubous • Bijoux • Prêt-à-porter</p>
                </div>
              </div>
              {/* Social links */}
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-african-gold-300 hover:text-white hover:bg-african-gold-600">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-african-gold-300 hover:text-white hover:bg-african-gold-600">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-african-gold-300 hover:text-white hover:bg-african-gold-600">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-african-gold-300">Navigation</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Accueil', href: '/' },
                  { name: 'Produits', href: '/products' },
                  { name: 'Box Beauté', href: '/boxes' },
                  { name: 'À propos', href: '/about' },
                  { name: 'Contact', href: '/contact' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-white hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-african-gold-300">Catégories</h4>
              <ul className="space-y-3">
                {[
                  'Boubous',
                  'Robes',
                  'Bijoux',
                  'Prêt-à-porter',
                  'Accessoires'
                ].map((category) => (
                  <li key={category}>
                    <Link 
                      to={`/products?category=${category.toLowerCase()}`}
                      className="text-white hover:text-white transition-colors"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-african-gold-300">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white">
                      Dakar, Sénégal
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white">+221 77 000 00 00</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-white flex-shrink-0" />
                  <p className="text-white">contact@loumo.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
   

      {/* Bottom bar */}
      <div className="border-t border-african-earth-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-white text-sm">
                © 2024 Natura Afrika. Tous droits réservés.
              </p>
              <div className="flex space-x-4 text-sm">
                <Link to="/privacy" className="text-white hover:text-african-gold-300 transition-colors">
                  Confidentialité
                </Link>
                <Link to="/terms" className="text-white hover:text-african-gold-300 transition-colors">
                  CGV
                </Link>
                <Link to="/cookies" className="text-white hover:text-african-gold-300 transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            
            {/* Admin creation form */}
            <CreateAdminForm />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
