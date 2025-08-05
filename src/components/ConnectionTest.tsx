import React, { useState } from 'react';
import { authService } from '@/services/AuthService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      console.log('🧪 Début du test de connectivité...');
      
      // Test 1: Connectivité de base
      const isConnected = await authService.testConnection();
      
      // Test 2: Test d'endpoint spécifique
      const testResults = {
        timestamp: new Date().toISOString(),
        backendUrl: 'https://back-lomou.onrender.com/api/auth',
        tests: []
      };

      // Test des endpoints
      const endpoints = [
        { name: 'Register', path: '/register', method: 'POST' },
        { name: 'Login', path: '/login', method: 'POST' },
        { name: 'Me', path: '/me', method: 'GET' },
        { name: 'Refresh', path: '/refresh', method: 'POST' }
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`https://back-lomou.onrender.com/api/auth${endpoint.path}`, {
            method: endpoint.method,
            headers: {
              'Content-Type': 'application/json',
            },
            ...(endpoint.method === 'POST' && {
              body: JSON.stringify({ test: true })
            })
          });

          testResults.tests.push({
            endpoint: endpoint.name,
            path: endpoint.path,
            method: endpoint.method,
            status: response.status,
            statusText: response.statusText,
            accessible: response.status !== 404,
            cors: response.headers.get('access-control-allow-origin') !== null
          });
        } catch (err: any) {
          testResults.tests.push({
            endpoint: endpoint.name,
            path: endpoint.path,
            method: endpoint.method,
            status: 'ERROR',
            statusText: err.message,
            accessible: false,
            cors: false
          });
        }
      }

      setTestResults(testResults);
      console.log('✅ Test de connectivité terminé:', testResults);
      
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Erreur lors du test:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number | string) => {
    if (status === 200) return 'text-green-600';
    if (status === 403) return 'text-orange-600';
    if (status === 404) return 'text-red-600';
    if (status === 'ERROR') return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusIcon = (status: number | string) => {
    if (status === 200) return '✅';
    if (status === 403) return '⚠️';
    if (status === 404) return '❌';
    if (status === 'ERROR') return '💥';
    return '❓';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Test de Connectivité Backend</CardTitle>
        <CardDescription>
          Testez la connectivité avec le serveur backend et diagnostiquez les problèmes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBackendConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '🔄 Test en cours...' : '🧪 Lancer le test de connectivité'}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testResults && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>URL Backend:</strong> {testResults.backendUrl}
              </div>
              <div>
                <strong>Timestamp:</strong> {new Date(testResults.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Résultats des tests:</h4>
              {testResults.tests.map((test: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getStatusIcon(test.status)}</span>
                    <div>
                      <div className="font-medium">{test.endpoint}</div>
                      <div className="text-sm text-gray-500">
                        {test.method} {test.path}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono ${getStatusColor(test.status)}`}>
                      {test.status} {test.statusText}
                    </div>
                    <div className="text-xs text-gray-500">
                      CORS: {test.cors ? '✅' : '❌'} | 
                      Accessible: {test.accessible ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert>
              <AlertDescription>
                <strong>Diagnostic:</strong><br />
                • <strong>403 Forbidden:</strong> Problème de configuration CORS ou de sécurité<br />
                • <strong>404 Not Found:</strong> Endpoint non configuré ou serveur inaccessible<br />
                • <strong>Erreur réseau:</strong> Problème de connectivité ou serveur arrêté
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 