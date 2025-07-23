
import React, { useState } from 'react';
import { Play, Clock, User, Star, BookOpen, Filter, Search, Heart, Eye, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Tutorials = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Tous les tutos', count: 12 },
    { id: 'looks', name: 'Idées de looks', count: 4 },
    { id: 'boubous', name: 'Boubous', count: 2 },
    { id: 'bijoux', name: 'Bijoux', count: 2 },
    { id: 'accessoires', name: 'Accessoires', count: 2 },
    { id: 'inspirations', name: 'Inspirations africaines', count: 2 }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Comment porter le boubou avec style ?',
      description: 'Astuces pour moderniser le boubou traditionnel et l’intégrer à votre garde-robe urbaine.',
      image: 'https://enfgjsucpmsmrqxencxz.supabase.co/storage/v1/object/public/menu//Hi%20babe.jpg',
      category: 'boubous',
      duration: '5 min',
      difficulty: 'Facile',
      rating: 4.8,
      views: 1200,
      author: 'LOUMO',
      isNew: true,
      tags: ['Boubou', 'Style', 'Mode']
    },
    {
      id: 2,
      title: 'Idées de looks avec nos bijoux africains',
      description: 'Inspirez-vous de nos créations pour accessoiriser vos tenues avec des bijoux artisanaux.',
      image: 'https://enfgjsucpmsmrqxencxz.supabase.co/storage/v1/object/public/menu//Toutes%20mes%20bubu.jpg',
      category: 'bijoux',
      duration: '7 min',
      difficulty: 'Facile',
      rating: 4.9,
      views: 900,
      author: 'LOUMO',
      isPopular: true,
      tags: ['Bijoux', 'Accessoires', 'Look']
    },
    {
      id: 3,
      title: 'Accessoiriser une robe wax',
      description: 'Conseils pour sublimer une robe en pagne africain avec des accessoires LOUMO.',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=250&fit=crop',
      category: 'looks',
      duration: '6 min',
      difficulty: 'Facile',
      rating: 4.7,
      views: 1100,
      author: 'LOUMO',
      tags: ['Robe', 'Accessoires', 'Wax']
    },
    {
      id: 4,
      title: 'Inspiration : tenues africaines pour l’été',
      description: 'Découvrez nos idées de tenues légères et colorées pour la saison estivale.',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=250&fit=crop',
      category: 'inspirations',
      duration: '4 min',
      difficulty: 'Facile',
      rating: 4.6,
      views: 800,
      author: 'LOUMO',
      tags: ['Inspiration', 'Été', 'Mode']
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
      case 'Facile':
        return 'bg-green-100 text-green-700';
      case 'Intermédiaire':
        return 'bg-orange-100 text-orange-700';
      case 'Avancé':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDD0] to-[#FDF6E3]">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="typography-hero text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FFFDD0] to-[#FAF3E0] bg-clip-text text-transparent">Tutos</span>
            <span className="text-[#D2A679]"> Mode Africaine</span>
          </h1>
          <p className="typography-body-large text-gray-700 max-w-3xl mx-auto mb-8">
            Découvrez nos conseils mode, idées de looks, inspirations africaines et astuces pour porter boubous, robes, bijoux et accessoires LOUMO.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FFFFF0]/80 backdrop-blur-sm px-6 py-3 rounded-full border border-[#F5F5DC] shadow-lg">
            <BookOpen className="h-5 w-5 text-[#D2A679]" />
            <span className="typography-caption text-gray-700">Nouveaux tutos chaque semaine</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-orange-200 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Rechercher un tutoriel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm typography-body"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="typography-caption text-gray-600">Filtrer par:</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-6 py-3 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                  : 'bg-white/80 border-orange-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              <span className="typography-caption font-medium">{category.name}</span>
              <Badge variant="secondary" className="ml-2 bg-white/20 text-current">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Featured Tutorial */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl p-8 mb-12 border border-orange-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white mb-4">
                <Star className="w-3 h-3 mr-1" />
                Tuto du moment
              </Badge>
              <h2 className="typography-display text-3xl font-bold mb-4 text-gray-800">
                Routine matinale pour peau mixte africaine
              </h2>
              <p className="typography-body-large text-gray-700 mb-6">
                Découvrez une routine matinale adaptée aux peaux mixtes avec des produits 
                100% naturels d'Afrique. Amara Diallo vous guide pas à pas.
              </p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="typography-caption text-gray-600">8 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="typography-caption text-gray-600">Amara Diallo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="typography-caption text-gray-600">4.8 (124 avis)</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Regarder maintenant
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=300&fit=crop"
                  alt="Tutorial featured"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-orange-500 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map((tutorial) => (
            <Card 
              key={tutorial.id}
              className="group cursor-pointer overflow-hidden border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={tutorial.image} 
                  alt={tutorial.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-orange-500 ml-1" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {tutorial.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      Nouveau
                    </Badge>
                  )}
                  {tutorial.isPopular && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                      Populaire
                    </Badge>
                  )}
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {tutorial.duration}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge 
                    variant="outline" 
                    className={getDifficultyColor(tutorial.difficulty)}
                  >
                    {tutorial.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                    <span className="typography-caption text-sm text-gray-600">{tutorial.rating}</span>
                  </div>
                </div>

                <h3 className="typography-heading font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {tutorial.title}
                </h3>

                <p className="typography-body text-gray-600 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {tutorial.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-orange-200 text-orange-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="typography-caption text-sm text-gray-600">{tutorial.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="typography-caption text-sm text-gray-600">{tutorial.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 rounded-full"
          >
            Charger plus de tutoriels
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tutorials;
