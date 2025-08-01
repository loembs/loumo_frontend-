import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CartValidationResult } from '@/types/cart';

interface CartNotificationsProps {
  validationResult: CartValidationResult | null;
  error: string | null;
  onClose?: () => void;
}

const CartNotifications: React.FC<CartNotificationsProps> = ({
  validationResult,
  error,
  onClose
}) => {
  if (!validationResult && !error) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {/* Erreur générale */}
      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-800 animate-in slide-in-from-right duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Erreurs de validation */}
      {validationResult?.errors && validationResult.errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50 text-red-800 animate-in slide-in-from-right duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              {validationResult.errors.map((error, index) => (
                <div key={index} className="text-sm">
                  • {error}
                </div>
              ))}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Avertissements */}
      {validationResult?.warnings && validationResult.warnings.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-800 animate-in slide-in-from-right duration-300">
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              {validationResult.warnings.map((warning, index) => (
                <div key={index} className="text-sm">
                  • {warning}
                </div>
              ))}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Succès */}
      {validationResult?.isValid && validationResult.errors.length === 0 && (
        <Alert className="border-green-200 bg-green-50 text-green-800 animate-in slide-in-from-right duration-300">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Article ajouté au panier avec succès !</span>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CartNotifications; 