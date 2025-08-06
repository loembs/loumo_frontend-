import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authService } from '@/services/AuthService';

export const ConnectionTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<{
    backend: boolean;
    auth: boolean;
    users: string;
  } | null>(null);
  const [testCredentials, setTestCredentials] = useState({
    email: 'client@loumo.com',
    password: 'password123'
  });

  const testBackendConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('idle');
    
    try {
      // Test de connectivité générale
      const isConnected = await authService.testConnection();
      
      if (isConnected) {
        setConnectionStatus('success');
        
        // Test des utilisateurs
        const response = await fetch('https://back-lomou.onrender.com/api/auth/test-users');
        const usersData = await response.text();
        
        setTestResults({
          backend: true,
          auth: true,
          users: usersData
        });
      } else {
        setConnectionStatus('error');
        setTestResults({
          backend: false,
          auth: false,
          users: 'Impossible de se connecter au backend'
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      setTestResults({
        backend: false,
        auth: false,
        users: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    
    try {
      const result = await authService.login(testCredentials.email, testCredentials.password);
      
      if (result) {
        setTestResults(prev => prev ? {
          ...prev,
          auth: true
        } : null);
      } else {
        setTestResults(prev => prev ? {
          ...prev,
          auth: false
        } : null);
      }
    } catch (error) {
      console.error('Erreur de test de connexion:', error);
      setTestResults(prev => prev ? {
        ...prev,
        auth: false
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (connectionStatus === 'success') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (connectionStatus === 'error') return <XCircle className="h-4 w-4 text-red-600" />;
    return <Wifi className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="secondary">Test en cours...</Badge>;
    if (connectionStatus === 'success') return <Badge variant="default" className="bg-green-100 text-green-800">Connecté</Badge>;
    if (connectionStatus === 'error') return <Badge variant="destructive">Erreur</Badge>;
    return <Badge variant="outline">Non testé</Badge>;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Test de connectivité backend
          </CardTitle>
          <CardDescription>
            Vérifiez la connectivité avec le serveur backend et testez les identifiants
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Statut de connexion</span>
            {getStatusBadge()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={testBackendConnection}
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
                  Tester la connexion
                </>
              )}
            </Button>

            <Button 
              onClick={testLogin}
              disabled={isLoading || connectionStatus !== 'success'}
              variant="outline"
              className="w-full"
            >
              Tester la connexion
            </Button>
          </div>

          {testResults && (
            <div className="space-y-3">
              <Alert>
                <AlertDescription className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Backend:</span>
                    {testResults.backend ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>Authentification:</span>
                    {testResults.auth ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Utilisateurs:</strong> {testResults.users}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="space-y-2">
            <Label>Identifiants de test</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                value={testCredentials.email}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
              />
              <Input
                type="password"
                value={testCredentials.password}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Mot de passe"
              />
            </div>
            <p className="text-xs text-gray-500">
              Identifiants par défaut: client@loumo.com / password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 