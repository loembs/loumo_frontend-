import { useState, useEffect, useCallback } from 'react';
import { User, RegisterFormData } from '@/types/auth';
import { authService } from '@/services/AuthService';

const IS_PRODUCTION = import.meta.env.PROD;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour masquer les données sensibles
  const maskSensitiveData = (data: any): any => {
    if (!data) return data;
    
    const masked = { ...data };
    if (masked.email) masked.email = masked.email.replace(/(.{2}).*(@.*)/, '$1***$2');
    if (masked.password) masked.password = '********';
    if (masked.phone) masked.phone = masked.phone?.replace(/(\+\d{3}\s\d{2}\s)\d{3}(\s\d{2}\s)\d{2}/, '$1***$2***');
    if (masked.address) masked.address = '***';
    
    return masked;
  };

  // Fonction pour logger de manière sécurisée
  const secureLog = (message: string, data?: any): void => {
    if (!IS_PRODUCTION) {
      if (data) {
        console.log(message, maskSensitiveData(data));
      } else {
        console.log(message);
      }
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      secureLog('🔐 Tentative de connexion:', { email, password });
      const response = await authService.login(email, password);
      setUser(response);
      secureLog('✅ Connexion réussie');
    } catch (error) {
      secureLog('❌ Échec de connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = userData;
      secureLog('🔐 Tentative d\'inscription:', registerData);
      const response = await authService.register(registerData);
      setUser(response);
      secureLog('✅ Inscription réussie');
    } catch (error) {
      secureLog('❌ Échec d\'inscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    secureLog('🚪 Déconnexion effectuée');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      if (userData) {
        secureLog('👤 Utilisateur rafraîchi:', userData);
      }
    } catch (error) {
      secureLog('❌ Erreur lors du refresh de l\'utilisateur');
      setUser(null);
    }
  }, []);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        await refreshUser();
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [refreshUser]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser
  };
}; 