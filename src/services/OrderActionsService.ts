import { Order } from './OrderService';

export class OrderActionsService {
  private static instance: OrderActionsService;

  static getInstance(): OrderActionsService {
    if (!OrderActionsService.instance) {
      OrderActionsService.instance = new OrderActionsService();
    }
    return OrderActionsService.instance;
  }

  // Contacter le support
  async contactSupport(order: Order): Promise<void> {
    try {
      // Ouvrir une nouvelle fenêtre avec les informations de contact
      const subject = encodeURIComponent(`Support - Commande ${order.orderNumber}`);
      const body = encodeURIComponent(`
Bonjour,

J'ai besoin d'aide concernant ma commande :
- Numéro de commande : ${order.orderNumber}
- Statut actuel : ${order.status}
- Date de commande : ${new Date(order.orderDate).toLocaleDateString('fr-FR')}
- Montant total : ${order.totalAmount.toLocaleString('fr-FR')} FCFA

Pouvez-vous m'aider ?

Cordialement,
${order.customerName}
      `);

      const mailtoLink = `mailto:support@loumo.com?subject=${subject}&body=${body}`;
      window.open(mailtoLink, '_blank');
    } catch (error) {
      console.error('Erreur lors de la prise de contact avec le support:', error);
      throw new Error('Impossible de contacter le support pour le moment');
    }
  }

  // Télécharger la facture
  async downloadInvoice(order: Order): Promise<void> {
    try {
      // Générer le contenu de la facture
      const invoiceContent = this.generateInvoiceContent(order);
      
      // Créer un blob et télécharger
      const blob = new Blob([invoiceContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${order.orderNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      throw new Error('Impossible de télécharger la facture pour le moment');
    }
  }

  // Suivre le colis
  async trackPackage(order: Order): Promise<void> {
    try {
      // Si la commande a un numéro de suivi, ouvrir le lien de suivi
      if (order.trackingNumber) {
        // Ouvrir le site de suivi (exemple avec un transporteur fictif)
        const trackingUrl = `https://tracking.example.com/track/${order.trackingNumber}`;
        window.open(trackingUrl, '_blank');
      } else {
        // Si pas de numéro de suivi, afficher un message
        alert(`Votre commande ${order.orderNumber} n'a pas encore de numéro de suivi. Veuillez contacter le support pour plus d'informations.`);
      }
    } catch (error) {
      console.error('Erreur lors du suivi du colis:', error);
      throw new Error('Impossible de suivre le colis pour le moment');
    }
  }

  // Générer le contenu HTML de la facture
  private generateInvoiceContent(order: Order): string {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.totalPrice.toLocaleString('fr-FR')} FCFA</td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${order.orderNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-info { margin-bottom: 30px; }
        .customer-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #f8f9fa; padding: 10px; border-bottom: 2px solid #ddd; }
        .total { font-size: 18px; font-weight: bold; text-align: right; }
        .footer { margin-top: 50px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>LOUMO - Boutique Africaine</h1>
        <h2>Facture</h2>
    </div>

    <div class="invoice-info">
        <p><strong>Numéro de facture :</strong> ${order.orderNumber}</p>
        <p><strong>Date :</strong> ${new Date(order.orderDate).toLocaleDateString('fr-FR')}</p>
        <p><strong>Statut :</strong> ${order.status}</p>
    </div>

    <div class="customer-info">
        <h3>Informations client</h3>
        <p><strong>Nom :</strong> ${order.customerName}</p>
        <p><strong>Téléphone :</strong> ${order.phoneNumber}</p>
        <p><strong>Adresse :</strong> ${order.shippingAddress}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHtml}
        </tbody>
    </table>

    <div class="total">
        <p>Total : ${order.totalAmount.toLocaleString('fr-FR')} FCFA</p>
    </div>

    <div class="footer">
        <p>Merci pour votre confiance !</p>
        <p>LOUMO - Votre boutique africaine de confiance</p>
        <p>Email : contact@loumo.com | Téléphone : +221 77 123 45 67</p>
    </div>
</body>
</html>
    `;
  }
}

export const orderActionsService = OrderActionsService.getInstance();

