
import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

const FeaturedProducts = () => {
  const { products, isLoading, error } = useProducts();
  
  // Prendre les 8 premiers produits comme "featured"
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-16 bg-white text-[#232323]">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Nos Sélections
            <span className="text-[#C79F61]"> Mode Africaine</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos boubous, robes, bijoux, accessoires et prêt-à-porter, confectionnés avec passion au Sénégal. 100% made in Africa, pour sublimer votre style partout dans le monde !
          </p>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Erreur lors du chargement des produits</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-[#D4A373] to-amber-500  text-white font-semibold px-8"
            asChild
          >
            <Link to="/products">
              Voir toute la boutique
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
