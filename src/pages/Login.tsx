
import React, { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { ConnectionTest } from '@/components/ConnectionTest';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    navigate('/'); // Rediriger vers la page d'accueil après connexion
  };

  const handleRegister = async (userData: any) => {
    await register(userData);
    navigate('/'); // Rediriger vers la page d'accueil après inscription
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-amber-400 rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-orange-300 rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à Loumo
            </Link>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
              title="Mode débogage"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setIsLogin(false)}
            isLoading={isLoading}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setIsLogin(true)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
