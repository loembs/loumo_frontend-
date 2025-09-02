import React from 'react';
import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConnectionErrorProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({ 
  error, 
  onRetry, 
  showRetry = true 
}) => {
  const getIcon = () => {
    if (error.includes('connexion') || error.includes('internet')) {
      return <WifiOff className="h-4 w-4" />;
    }
    if (error.includes('indisponible') || error.includes('503')) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Wifi className="h-4 w-4" />;
  };

  const getVariant = () => {
    if (error.includes('connexion') || error.includes('internet')) {
      return 'destructive' as const;
    }
    if (error.includes('indisponible') || error.includes('503')) {
      return 'default' as const;
    }
    return 'destructive' as const;
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertTitle>Problème de connexion</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
