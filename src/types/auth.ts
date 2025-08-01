export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'ADMIN';
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'ADMIN';
  avatar?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
} 