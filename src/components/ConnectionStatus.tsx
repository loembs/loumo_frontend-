import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  isOnline: boolean;
  isUsingCache: boolean;
  isUsingFallback: boolean;
  onRetry?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isOnline,
  isUsingCache,
  isUsingFallback,
  onRetry
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOnline || isUsingCache || isUsingFallback) {
      setShow(true);
      // Masquer automatiquement après 5 secondes si en ligne
      if (isOnline && !isUsingFallback) {
        const timer = setTimeout(() => setShow(false), 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isOnline, isUsingCache, isUsingFallback]);

  if (!show) return null;

  const getStatusInfo = () => {
    if (isUsingFallback) {
      return {
        variant: 'destructive' as const,
        icon: <WifiOff className="h-4 w-4" />,
        title: 'Mode hors ligne',
        description: 'Affichage des produits de démonstration. Certaines fonctionnalités peuvent être limitées.'
      };
    }
    
    if (isUsingCache) {
      return {
        variant: 'default' as const,
        icon: <Wifi className="h-4 w-4" />,
        title: 'Données en cache',
        description: 'Affichage des données mises en cache. Actualisation en cours...'
      };
    }
    
    return {
      variant: 'default' as const,
      icon: <Wifi className="h-4 w-4" />,
      title: 'Connexion rétablie',
      description: 'Connexion au serveur rétablie avec succès.'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Alert variant={statusInfo.variant} className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {statusInfo.icon}
          <div>
            <AlertDescription className="font-medium">
              {statusInfo.title}
            </AlertDescription>
            <AlertDescription className="text-sm opacity-80">
              {statusInfo.description}
            </AlertDescription>
          </div>
        </div>
        
        {isUsingFallback && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Réessayer
          </Button>
        )}
      </div>
    </Alert>
  );
};
