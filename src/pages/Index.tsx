
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';
import { MarketplaceHome } from '@/components/marketplace/MarketplaceHome';
import { FeaturedShops } from '@/components/marketplace/FeaturedShops';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#232323]">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <MarketplaceHome />
        <FeaturedShops />
        {/* Values section */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
