import { User, AuthResponse } from '@/types/auth';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://back-lomou.onrender.com/api/auth'
  : 'http://localhost:8083/api/auth';
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
    if (!IS_PRODUCTION) {
      if (data) {
        console.log(message, this.maskSensitiveData(data));
      } else {
        console.log(message);
      }
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
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.secureLog('❌ Erreur lors de l\'inscription:', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      throw new Error(`Erreur lors de l'inscription: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.token, data.refreshToken);
    this.currentUser = data;
    
    this.secureLog('✅ Inscription réussie pour:', data);
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    this.secureLog('🔐 Tentative de connexion:', { email, password });
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      this.secureLog('❌ Échec de connexion');
      throw new Error('Email ou mot de passe incorrect');
    }

    const data: AuthResponse = await response.json();
    this.setTokens(data.token, data.refreshToken);
    this.currentUser = data;
    
    this.secureLog('✅ Connexion réussie:', data);
    return data;
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