import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Wifi } from 'lucide-react';

const API_BASE_URL = 'https://back-lomou.onrender.com/api/auth';

export const BackendTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBackend = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    const testResults: any = {};

         try {
       // Test 0: Connectivité de base
       console.log('🔍 Test 0: Connectivité de base');
       try {
         const baseResponse = await fetch('https://back-lomou.onrender.com', {
           method: 'HEAD',
         });
         testResults.base = {
           status: baseResponse.status,
           statusText: baseResponse.statusText,
           body: 'Connectivité OK',
           success: true
         };
         console.log('✅ Connectivité de base:', testResults.base);
       } catch (err) {
         testResults.base = {
           error: err instanceof Error ? err.message : 'Erreur inconnue',
           success: false
         };
         console.error('❌ Connectivité de base échouée:', err);
       }

       // Test 1: Endpoint /test
       console.log('🔍 Test 1: Endpoint /test');
       try {
         const testResponse = await fetch(`${API_BASE_URL}/test`, {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
         });
         const testBody = await testResponse.text();
         testResults.test = {
           status: testResponse.status,
           statusText: testResponse.statusText,
           body: testBody,
           success: testResponse.ok
         };
         console.log('✅ Test /test:', testResults.test);
       } catch (err) {
         testResults.test = {
           error: err instanceof Error ? err.message : 'Erreur inconnue',
           success: false
         };
         console.error('❌ Test /test échoué:', err);
       }

      // Test 2: Endpoint /test-users
      console.log('🔍 Test 2: Endpoint /test-users');
      try {
        const usersResponse = await fetch(`${API_BASE_URL}/test-users`);
        const usersBody = await usersResponse.text();
        testResults.users = {
          status: usersResponse.status,
          statusText: usersResponse.statusText,
          body: usersBody,
          success: usersResponse.ok
        };
        console.log('✅ Test /test-users:', testResults.users);
      } catch (err) {
        testResults.users = {
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          success: false
        };
        console.error('❌ Test /test-users échoué:', err);
      }

      // Test 3: Endpoint /me (sans token)
      console.log('🔍 Test 3: Endpoint /me (sans token)');
      try {
        const meResponse = await fetch(`${API_BASE_URL}/me`);
        const meBody = await meResponse.text();
        testResults.me = {
          status: meResponse.status,
          statusText: meResponse.statusText,
          body: meBody,
          success: meResponse.ok
        };
        console.log('✅ Test /me:', testResults.me);
      } catch (err) {
        testResults.me = {
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          success: false
        };
        console.error('❌ Test /me échoué:', err);
      }

      // Test 4: Test de connexion avec identifiants de test
      console.log('🔍 Test 4: Test de connexion');
      try {
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'client@loumo.com',
            password: 'password123'
          })
        });
        
        const loginBody = await loginResponse.text();
        testResults.login = {
          status: loginResponse.status,
          statusText: loginResponse.statusText,
          body: loginBody,
          success: loginResponse.ok
        };
        console.log('✅ Test login:', testResults.login);
      } catch (err) {
        testResults.login = {
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          success: false
        };
        console.error('❌ Test login échoué:', err);
      }

      setResults(testResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Test de connectivité backend
          </CardTitle>
          <CardDescription>
            Test complet de tous les endpoints d'authentification
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
                Lancer les tests
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {results && (
            <div className="space-y-4">
              <h3 className="font-semibold">Résultats des tests :</h3>
              
              {Object.entries(results).map(([testName, result]: [string, any]) => (
                <div key={testName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{testName}</h4>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 