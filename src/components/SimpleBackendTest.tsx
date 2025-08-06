import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Wifi, Info } from 'lucide-react';

const API_BASE_URL = 'https://back-lomou.onrender.com';

export const SimpleBackendTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testBackend = async () => {
    setIsLoading(true);
    setResults(null);

    const testResults: any = {};

    try {
      // Test 1: Vérifier si le serveur répond
      console.log('🔍 Test 1: Serveur accessible');
      try {
        const response = await fetch(`${API_BASE_URL}`, {
          method: 'GET',
        });
        testResults.server = {
          status: response.status,
          statusText: response.statusText,
          success: true
        };
        console.log('✅ Serveur accessible:', testResults.server);
      } catch (err) {
        testResults.server = {
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          success: false
        };
        console.error('❌ Serveur inaccessible:', err);
      }

      // Test 2: Endpoint /api/auth/test
      console.log('🔍 Test 2: Endpoint /api/auth/test');
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const body = await response.text();
        testResults.authTest = {
          status: response.status,
          statusText: response.statusText,
          body: body,
          success: response.ok
        };
        console.log('✅ Auth test:', testResults.authTest);
      } catch (err) {
        testResults.authTest = {
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          success: false
        };
        console.error('❌ Auth test échoué:', err);
      }

      // Test 3: Test de connexion simple
      console.log('🔍 Test 3: Test de connexion');
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'client@loumo.com',
            password: 'password123'
          })
        });
        
        const body = await response.text();
        testResults.login = {
          status: response.status,
          statusText: response.statusText,
          body: body,
          success: response.ok
        };
        console.log('✅ Login test:', testResults.login);
      } catch (err) {
        testResults.login = {
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          success: false
        };
        console.error('❌ Login test échoué:', err);
      }

      setResults(testResults);
    } catch (err) {
      console.error('Erreur générale:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (success: boolean) => {
    return success ? 
      <Badge variant="default" className="bg-green-100 text-green-800">Succès</Badge> : 
      <Badge variant="destructive">Échec</Badge>;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Test simple du backend
          </CardTitle>
          <CardDescription>
            Test basique de connectivité et des endpoints principaux
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ce test vérifie la connectivité de base et les endpoints d'authentification.
              Les erreurs 405 et 400 indiquent des problèmes de configuration.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={testBackend}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Tester le backend
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4">
              <h3 className="font-semibold">Résultats :</h3>
              
              {Object.entries(results).map(([testName, result]: [string, any]) => (
                <div key={testName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">
                      {testName === 'server' ? 'Serveur' : 
                       testName === 'authTest' ? 'Auth Test' : 
                       testName === 'login' ? 'Connexion' : testName}
                    </h4>
                    {getStatusBadge(result.success)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.success)}
                      <span>Statut: {result.status || 'N/A'} {result.statusText || ''}</span>
                    </div>
                    
                    {result.error ? (
                      <div className="text-red-600">
                        <strong>Erreur:</strong> {result.error}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Réponse:</strong>
                        <pre className="text-xs mt-1 overflow-auto max-h-32">
                          {result.body || 'Aucune réponse'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <Alert>
                <AlertDescription>
                  <strong>Diagnostic :</strong><br/>
                  • Si le serveur est accessible mais les endpoints échouent, il y a un problème de configuration Spring Boot<br/>
                  • Les erreurs 405 indiquent des problèmes de méthodes HTTP autorisées<br/>
                  • Les erreurs 400 indiquent des problèmes de validation ou d'authentification
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 