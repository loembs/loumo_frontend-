
import React from 'react';
import { ArrowRight, Sparkles, Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-[#F8F5EC] via-[#FAF9F6] to-[#FDFBF6] pattern-overlay overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#F8F5EC] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#FAF9F6] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#FDFBF6] rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-african-gold-500" />
              <span className="typography-subheading text-african-gold-600">100% Made in Africa • Mode & Artisanat</span>
            </div>

            <h1 className="typography-hero text-4xl lg:text-6xl text-gray-800 mb-6 text-shadow-soft">
              L'élégance africaine
              <span className="text-[#D4A373]"> à portée de main</span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-african-gold-500 to-african-gold-600 hover:from-african-gold-600 hover:to-african-gold-600 text-white typography-body font-semibold px-8"
                asChild
              >
                <Link to="/products">
                  Découvrir la boutique
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-african-gold-300 text-african-gold-700 hover:bg-african-gold-50 typography-body"
                asChild
              >
                <Link to="/tutorials">
                  Conseils & Looks
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                
              </div>
              <div className="flex items-center space-x-3">
                  
              </div>

              <div className="flex items-center space-x-3">
               
                
              </div>
            </div>
          </div>
          {/* Right content - Hero image */}
          <div className="relative animate-slide-up">
            <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 border border-african-gold-100 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-african-gold-100 to-african-gold-100 rounded-2xl flex items-center justify-center relative z-10">
                {/* Video background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover rounded-3xl z-0"
                style={{ opacity: 0.25 }}
                src="https://enfgjsucpmsmrqxencxz.supabase.co/storage/v1/object/public/menu//videorobe.mp4"
              />
                <div className="text-center">
                  <h3 className="typography-display text-2xl text-gray-800 mb-2 text-shadow-soft">LOUMO</h3>
                  <p className="typography-accent text-gray-600">Boubous, Robes, Bijoux, Accessoires</p>
                  
                  {/* Showcase produits */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
    
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-african-gold-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-african-green-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
