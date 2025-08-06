import { Product } from '@/types/product';

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  constructor(private url: string = 'wss://back-lomou.onrender.com/ws') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Vérifier si le navigateur supporte WebSocket
        if (typeof WebSocket === 'undefined') {
          console.warn('⚠️ WebSocket non supporté par le navigateur');
          resolve(); // Résoudre sans erreur pour ne pas bloquer l'app
          return;
        }

        this.socket = new WebSocket(this.url);
        
        // Timeout pour éviter les blocages
        const timeout = setTimeout(() => {
          if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            console.warn('⚠️ Timeout de connexion WebSocket');
            this.socket.close();
            resolve(); // Résoudre sans erreur
          }
        }, 5000);
        
        this.socket.onopen = () => {
          clearTimeout(timeout);
          console.log('🔌 WebSocket connecté');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onclose = (event) => {
          clearTimeout(timeout);
          console.log('🔌 WebSocket déconnecté', event.code, event.reason);
          // Ne pas essayer de se reconnecter si c'est une fermeture normale
          if (event.code !== 1000) {
            this.handleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          clearTimeout(timeout);
          console.error('❌ Erreur WebSocket:', error);
          // Ne pas rejeter, juste logger l'erreur
          resolve();
        };

      } catch (error) {
        console.error('❌ Erreur de connexion WebSocket:', error);
        resolve(); // Résoudre sans erreur pour ne pas bloquer l'app
      }
    });
  }

  private handleMessage(data: string) {
    try {
      const message = JSON.parse(data);
      console.log('📨 Message WebSocket reçu:', message);

      // Notifier les listeners selon le type de message
      if (message.productId) {
        this.notifyListeners('productUpdate', message);
      } else if (typeof message === 'string' && message === 'refresh') {
        this.notifyListeners('cacheInvalidate', message);
      }
    } catch (error) {
      console.error('❌ Erreur parsing message WebSocket:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          this.handleReconnect();
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  unsubscribe(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('❌ Erreur dans le callback WebSocket:', error);
        }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Instance singleton
export const webSocketService = new WebSocketService(); 