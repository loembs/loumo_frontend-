
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-amber-400 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-orange-300 rounded-full"></div>
      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border border-orange-200">
        <CardHeader className="text-center pb-8">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à Loumo
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isAdmin ? 'Espace Admin' : 'Connexion'}
          </CardTitle>
          <p className="text-gray-600">
            {isAdmin ? 'Gérez votre boutique Loumo' : 'Accédez à votre compte Loumo'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isAdmin 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isAdmin 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 border-orange-200 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105">
            {isAdmin ? 'Accéder à l\'admin' : 'Se connecter'}
          </Button>

          {!isAdmin && (
            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 hover:underline">
                Mot de passe oublié ?
              </Link>
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
