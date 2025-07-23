
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://back-lomou.onrender.com/api/product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

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
