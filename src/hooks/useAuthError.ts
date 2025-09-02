import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useAuthError = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      const { message, redirectTo } = event.detail;
      
      // Afficher un toast informatif
      toast({
        title: "Authentification requise",
        description: message,
        variant: "destructive",
      });
      
      // Rediriger vers la page de connexion
      if (redirectTo) {
        navigate(redirectTo);
      }
    };

    // Écouter les événements d'erreur d'authentification
    window.addEventListener('authError', handleAuthError as EventListener);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      window.removeEventListener('authError', handleAuthError as EventListener);
    };
  }, [navigate, toast]);
};
