export interface CardInfo {
  number: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface MobileMoneyInfo {
  phoneNumber: string;
  provider: 'orange' | 'mtn' | 'moov';
}

export interface PaymentInfo {
  method: 'card' | 'mobile_money' | 'cash_on_delivery';
  amount: number;
  currency: string;
  cardInfo?: CardInfo;
  mobileMoneyInfo?: MobileMoneyInfo;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  message?: string;
}

export class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async processPayment(paymentInfo: PaymentInfo): Promise<PaymentResult> {
    try {
      console.log('💳 Traitement du paiement:', {
        method: paymentInfo.method,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency
      });

      // Simulation du traitement de paiement
      // En production, cela serait remplacé par un vrai appel API
      await this.simulatePaymentProcessing(paymentInfo);

      const transactionId = this.generateTransactionId();

      console.log('✅ Paiement traité avec succès:', { transactionId });

      return {
        success: true,
        transactionId,
        message: 'Paiement traité avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur lors du traitement du paiement:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors du paiement'
      };
    }
  }

  private async simulatePaymentProcessing(paymentInfo: PaymentInfo): Promise<void> {
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulation d'erreurs pour certains cas
    if (paymentInfo.method === 'card' && paymentInfo.cardInfo) {
      // Vérification basique du numéro de carte
      if (paymentInfo.cardInfo.number.length < 13) {
        throw new Error('Numéro de carte invalide');
      }

      // Vérification de la date d'expiration
      const [month, year] = paymentInfo.cardInfo.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expiryDate < new Date()) {
        throw new Error('Carte expirée');
      }

      // Vérification du CVV
      if (paymentInfo.cardInfo.cvv.length < 3) {
        throw new Error('Code CVV invalide');
      }
    }

    if (paymentInfo.method === 'mobile_money' && paymentInfo.mobileMoneyInfo) {
      // Vérification du numéro de téléphone
      const phoneRegex = /^(\+225|225)?[0-9]{8}$/;
      if (!phoneRegex.test(paymentInfo.mobileMoneyInfo.phoneNumber.replace(/\s/g, ''))) {
        throw new Error('Numéro de téléphone invalide');
      }
    }

    // Simulation d'un taux d'échec de 5%
    if (Math.random() < 0.05) {
      throw new Error('Erreur temporaire du système de paiement');
    }
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN_${timestamp}_${random}`.toUpperCase();
  }

  validateCardInfo(cardInfo: CardInfo): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation du numéro de carte (algorithme de Luhn simplifié)
    if (!this.isValidCardNumber(cardInfo.number)) {
      errors.push('Numéro de carte invalide');
    }

    // Validation de la date d'expiration
    if (!this.isValidExpiryDate(cardInfo.expiryDate)) {
      errors.push('Date d\'expiration invalide');
    }

    // Validation du CVV
    if (!/^\d{3,4}$/.test(cardInfo.cvv)) {
      errors.push('Code CVV invalide');
    }

    // Validation du nom du titulaire
    if (!cardInfo.cardholderName.trim() || cardInfo.cardholderName.length < 2) {
      errors.push('Nom du titulaire invalide');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidCardNumber(number: string): boolean {
    const cleanNumber = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanNumber)) {
      return false;
    }

    // Algorithme de Luhn simplifié
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

  private isValidExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/');
    
    if (!month || !year) return false;
    
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return false;
    }
    
    return true;
  }

  getSupportedPaymentMethods(): Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }> {
    return [
      {
        id: 'card',
        name: 'Carte bancaire',
        description: 'Visa, Mastercard, American Express',
        icon: '💳'
      },
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Orange Money, MTN Mobile Money, Moov Money',
        icon: '📱'
      },
      {
        id: 'cash_on_delivery',
        name: 'Paiement à la livraison',
        description: 'Payez en espèces à la réception',
        icon: '💰'
      }
    ];
  }

  formatCardNumber(number: string): string {
    const cleanNumber = number.replace(/\s/g, '');
    const groups = cleanNumber.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleanNumber;
  }

  formatExpiryDate(date: string): string {
    const cleanDate = date.replace(/\D/g, '');
    if (cleanDate.length >= 2) {
      return cleanDate.substring(0, 2) + '/' + cleanDate.substring(2, 4);
    }
    return cleanDate;
  }
}

export const paymentService = PaymentService.getInstance(); 