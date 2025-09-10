// Configuration des constantes de l'application
export const API_BASE_URL = 'https://back-lomou.onrender.com/api';

// Configuration des endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  PRODUCTS: {
    ALL: '/product',
    BY_ID: '/product/:id',
    BY_CATEGORY: '/product/category/:category'
  },
  ORDERS: {
    CREATE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    ALL: '/orders/admin/all',
    BY_ID: '/orders/:id',
    UPDATE_STATUS: '/orders/:id/status',
    STATISTICS: '/orders/admin/statistics'
  },
  ADMIN: {
    CREATE: '/audit/create-user',
  },
  SHOP:{
    SEARCH : '/search'
  }
};

// Configuration des rôles
export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT'
} as const;

// Configuration des statuts de commande
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

// Configuration des méthodes de paiement
export const PAYMENT_METHODS = {
  CARD: 'card',
  MOBILE_MONEY: 'mobile_money',
  CASH_ON_DELIVERY: 'cash_on_delivery'
} as const;

// Configuration des fournisseurs Mobile Money
export const MOBILE_MONEY_PROVIDERS = {
  ORANGE: 'orange',
  MTN: 'mtn',
  MOOV: 'moov'
} as const;

// Configuration de l'application
export const APP_CONFIG = {
  NAME: 'LOUMO',
  DESCRIPTION: 'Boubous • Bijoux • Prêt-à-porter',
  VERSION: '1.0.0',
  CURRENCY: 'XOF',
  CURRENCY_SYMBOL: 'FCFA'
};

// Configuration du cache
export const CACHE_CONFIG = {
  PRODUCTS_CACHE_KEY: 'loumo_products_cache',
  PRODUCTS_CACHE_VERSION: '1.0',
  PRODUCTS_CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  PRODUCTS_STALE_WHILE_REVALIDATE: 5 * 60 * 1000 // 5 minutes
};

// Configuration des messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  AUTHENTICATION_ERROR: 'Erreur d\'authentification',
  VALIDATION_ERROR: 'Erreur de validation des données',
  PAYMENT_ERROR: 'Erreur de paiement',
  ORDER_ERROR: 'Erreur lors de la création de la commande',
  UNKNOWN_ERROR: 'Une erreur inconnue est survenue'
};

// Configuration des messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  ORDER_SUCCESS: 'Commande créée avec succès',
  PAYMENT_SUCCESS: 'Paiement traité avec succès'
}; 