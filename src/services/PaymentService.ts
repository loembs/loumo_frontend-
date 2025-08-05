export interface PaymentInfo {
  method: 'card' | 'mobile_money' | 'cash_on_delivery';
  amount: number;
  currency: string;
  cardInfo?: {
    number: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  mobileMoneyInfo?: {
    phoneNumber: string;
    provider: 'orange' | 'mtn' | 'moov';
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  message?: string;
}

class PaymentService {
  private secureLog(message: string, data?: any) {
    if (import.meta.env.DEV) {
      console.log(`💳 [PaymentService] ${message}`, data);
    }
  }

  async processPayment(paymentInfo: PaymentInfo): Promise<PaymentResult> {
    this.secureLog('Traitement du paiement:', { method: paymentInfo.method, amount: paymentInfo.amount });

    try {
      switch (paymentInfo.method) {
        case 'card':
          return await this.processCardPayment(paymentInfo);
        case 'mobile_money':
          return await this.processMobileMoneyPayment(paymentInfo);
        case 'cash_on_delivery':
          return await this.processCashOnDelivery(paymentInfo);
        default:
          throw new Error('Méthode de paiement non supportée');
      }
    } catch (error) {
      this.secureLog('Erreur de paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  private async processCardPayment(paymentInfo: PaymentInfo): Promise<PaymentResult> {
    this.secureLog('Traitement paiement carte');
    
    // Validation des informations de carte
    if (!paymentInfo.cardInfo) {
      throw new Error('Informations de carte manquantes');
    }

    const { number, expiryDate, cvv, cardholderName } = paymentInfo.cardInfo;

    // Validation basique
    if (!this.validateCardNumber(number)) {
      throw new Error('Numéro de carte invalide');
    }

    if (!this.validateExpiryDate(expiryDate)) {
      throw new Error('Date d\'expiration invalide');
    }

    if (!this.validateCVV(cvv)) {
      throw new Error('Code CVV invalide');
    }

    if (!cardholderName.trim()) {
      throw new Error('Nom du titulaire requis');
    }

    // Simulation du traitement
    await this.simulateProcessing(2000);

    // Simuler un échec occasionnel (10% de chance)
    if (Math.random() < 0.1) {
      throw new Error('Transaction refusée par la banque');
    }

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.secureLog('Paiement carte réussi:', { transactionId });

    return {
      success: true,
      transactionId,
      message: 'Paiement par carte traité avec succès'
    };
  }

  private async processMobileMoneyPayment(paymentInfo: PaymentInfo): Promise<PaymentResult> {
    this.secureLog('Traitement paiement Mobile Money');
    
    if (!paymentInfo.mobileMoneyInfo) {
      throw new Error('Informations Mobile Money manquantes');
    }

    const { phoneNumber, provider } = paymentInfo.mobileMoneyInfo;

    if (!phoneNumber.trim()) {
      throw new Error('Numéro de téléphone requis');
    }

    // Simulation du traitement
    await this.simulateProcessing(3000);

    // Simuler un échec occasionnel (15% de chance)
    if (Math.random() < 0.15) {
      throw new Error('Paiement Mobile Money échoué');
    }

    const transactionId = `MM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.secureLog('Paiement Mobile Money réussi:', { transactionId, provider });

    return {
      success: true,
      transactionId,
      message: `Paiement ${provider} traité avec succès. Vous recevrez un SMS de confirmation.`
    };
  }

  private async processCashOnDelivery(paymentInfo: PaymentInfo): Promise<PaymentResult> {
    this.secureLog('Traitement paiement à la livraison');
    
    // Simulation du traitement
    await this.simulateProcessing(1000);

    const transactionId = `COD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.secureLog('Paiement à la livraison confirmé:', { transactionId });

    return {
      success: true,
      transactionId,
      message: 'Paiement à la livraison confirmé. Payez lors de la réception de votre commande.'
    };
  }

  private validateCardNumber(number: string): boolean {
    // Algorithme de Luhn pour valider le numéro de carte
    const cleanNumber = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private validateExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1]);
    const year = parseInt(match[2]);

    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  private validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  private simulateProcessing(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // Méthodes utilitaires pour le formatage
  formatCardNumber(number: string): string {
    const clean = number.replace(/\s/g, '');
    const groups = clean.match(/.{1,4}/g);
    return groups ? groups.join(' ') : clean;
  }

  formatExpiryDate(date: string): string {
    const clean = date.replace(/\D/g, '');
    if (clean.length >= 2) {
      return clean.substring(0, 2) + '/' + clean.substring(2, 4);
    }
    return clean;
  }

  getSupportedMobileMoneyProviders() {
    return [
      { id: 'orange', name: 'Orange Money', color: 'orange' },
      { id: 'mtn', name: 'MTN Mobile Money', color: 'yellow' },
      { id: 'moov', name: 'Moov Money', color: 'blue' }
    ];
  }
}

export const paymentService = new PaymentService(); 