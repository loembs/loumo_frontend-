import { User, AuthResponse } from '@/types/auth';

const API_BASE_URL = 'https://back-lomou.onrender.com/api/auth';
const IS_PRODUCTION = import.meta.env.PROD;

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Fonction pour masquer les données sensibles
  private maskSensitiveData(data: any): any {
    if (!data) return data;
    
    const masked = { ...data };
    if (masked.email) masked.email = masked.email.replace(/(.{2}).*(@.*)/, '$1***$2');
    if (masked.password) masked.password = '********';
    if (masked.phone) masked.phone = masked.phone.replace(/(\+\d{3}\s\d{2}\s)\d{3}(\s\d{2}\s)\d{2}/, '$1***$2***');
    if (masked.address) masked.address = '***';
    
    return masked;
  }

  // Fonction pour logger de manière sécurisée
  private secureLog(message: string, data?: any): void {
    // Toujours logger en mode développement pour le débogage
    if (data) {
      console.log(`[AuthService] ${message}`, this.maskSensitiveData(data));
    } else {
      console.log(`[AuthService] ${message}`);
    }
  }

  // Fonction pour tester la connectivité
  async testConnection(): Promise<boolean> {
    try {
      this.secureLog('🔍 Test de connectivité vers le backend...');
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      this.secureLog('📡 Réponse du serveur:', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}/me`
      });
      
      return response.status !== 404;
    } catch (error) {
      this.secureLog('❌ Erreur de connectivité:', { error: error.message });
      return false;
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> {
    this.secureLog('🔐 Tentative d\'inscription:', userData);
    
    try {
      // Test de connectivité avant l'inscription
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      this.secureLog('📡 Réponse du serveur (register):', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}/register`,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.secureLog('❌ Erreur lors de l\'inscription:', { 
          status: response.status, 
          statusText: response.statusText,
          error: errorText,
          url: `${API_BASE_URL}/register`
        });
        
        // Messages d'erreur plus spécifiques
        if (response.status === 403) {
          throw new Error('Accès interdit. Problème de configuration CORS ou de sécurité.');
        } else if (response.status === 404) {
          throw new Error('Endpoint non trouvé. Vérifiez la configuration du serveur.');
        } else {
          throw new Error(`Erreur lors de l'inscription: ${response.status} ${response.statusText}`);
        }
      }

      const data: AuthResponse = await response.json();
      this.setTokens(data.token, data.refreshToken);
      this.currentUser = data;
      
      this.secureLog('✅ Inscription réussie pour:', data);
      return data;
    } catch (error) {
      this.secureLog('❌ Erreur réseau lors de l\'inscription:', { error: error.message });
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    this.secureLog('🔐 Tentative de connexion:', { email, password });
    
    try {
      // Test de connectivité avant la connexion
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      }

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      this.secureLog('📡 Réponse du serveur (login):', {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}/login`,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.secureLog('❌ Échec de connexion:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        if (response.status === 403) {
          throw new Error('Accès interdit. Problème de configuration CORS ou de sécurité.');
        } else if (response.status === 404) {
          throw new Error('Endpoint de connexion non trouvé. Vérifiez la configuration du serveur.');
        } else {
          throw new Error('Email ou mot de passe incorrect');
        }
      }

      const data: AuthResponse = await response.json();
      this.setTokens(data.token, data.refreshToken);
      this.currentUser = data;
      
      this.secureLog('✅ Connexion réussie:', data);
      return data;
    } catch (error) {
      this.secureLog('❌ Erreur réseau lors de la connexion:', { error: error.message });
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        this.currentUser = data;
        this.secureLog('👤 Utilisateur récupéré:', data);
        return data;
      }
    } catch (error) {
      this.secureLog('❌ Erreur lors de la récupération de l\'utilisateur');
    }

    return null;
  }

  async refreshToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();
        this.setTokens(data.token, data.refreshToken);
        this.currentUser = data;
        this.secureLog('🔄 Token rafraîchi avec succès');
        return true;
      }
    } catch (error) {
      this.secureLog('❌ Erreur lors du refresh du token');
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUser = null;
    this.secureLog('🚪 Déconnexion effectuée');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }

  isClient(): boolean {
    return this.currentUser?.role === 'CLIENT';
  }

  getCurrentUserData(): User | null {
    return this.currentUser ? this.maskSensitiveData(this.currentUser) : null;
  }

  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export const authService = AuthService.getInstance(); 