# Système de Panier LOUMO - Architecture SOLID

## Vue d'ensemble

Le système de panier de LOUMO est conçu selon les principes SOLID pour offrir une expérience utilisateur fluide avec validation robuste et persistance locale.

## Architecture SOLID

### 1. **Single Responsibility Principle (SRP)**
Chaque service a une responsabilité unique :

- **`CartValidationService`** : Validation des articles et du panier
- **`CartStorageService`** : Persistance et gestion du localStorage
- **`CartCalculationService`** : Calculs des prix et frais de livraison
- **`CartService`** : Orchestration des opérations du panier

### 2. **Open/Closed Principle (OCP)**
Le système est ouvert à l'extension mais fermé à la modification :

```typescript
// Facile d'ajouter de nouveaux types de validation
export class CartValidationService {
  static validateAddItem(item: Omit<CartItem, 'quantity'>, quantity: number, currentItems: CartItem[]): CartValidationResult {
    // Logique de validation extensible
  }
}
```

### 3. **Liskov Substitution Principle (LSP)**
Les services peuvent être remplacés par des implémentations alternatives :

```typescript
export interface CartService {
  getCart(): Cart;
  addItem(request: AddToCartRequest): CartValidationResult;
  // ... autres méthodes
}
```

### 4. **Interface Segregation Principle (ISP)**
Interfaces spécifiques pour chaque besoin :

```typescript
export interface AddToCartRequest {
  item: Omit<CartItem, 'quantity'>;
  quantity: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}
```

### 5. **Dependency Inversion Principle (DIP)**
Les composants dépendent d'abstractions, pas de détails :

```typescript
// Hook React qui utilise le service
export const useCart = () => {
  const cartService = new CartService(); // Injection de dépendance
  // ...
};
```

## Structure des fichiers

```
src/
├── types/
│   └── cart.ts                    # Types TypeScript
├── services/
│   ├── CartService.ts             # Service principal
│   ├── CartValidationService.ts   # Validation
│   ├── CartStorageService.ts      # Persistance
│   └── CartCalculationService.ts  # Calculs
├── hooks/
│   └── useCart.ts                 # Hook React
└── components/
    └── CartNotifications.tsx      # Notifications UI
```

## Fonctionnalités

### ✅ Validation robuste
- Quantité maximale par article (10)
- Nombre maximum d'articles dans le panier (50)
- Montant minimum de commande (5€)
- Montant maximum de commande (10 000€)
- Vérification de disponibilité des articles

### ✅ Persistance locale
- Sauvegarde automatique dans localStorage
- Migration de versions
- Nettoyage automatique après 7 jours
- Gestion d'erreurs robuste

### ✅ Calculs intelligents
- Livraison gratuite dès 50€
- Calcul automatique des totaux
- Options de livraison multiples
- Formatage des prix en français

### ✅ UX optimisée
- Notifications en temps réel
- États de chargement
- Gestion d'erreurs utilisateur
- Animations fluides

## Utilisation

### Dans un composant React

```typescript
import { useCart } from '@/hooks/useCart';

const MyComponent = () => {
  const { 
    cart, 
    addItem, 
    updateItem, 
    removeItem, 
    isLoading, 
    error, 
    validationResult 
  } = useCart();

  const handleAddToCart = async () => {
    const result = await addItem({
      item: {
        id: 'product-1',
        name: 'Boubou africain',
        price: 45.90,
        image: 'url-image',
        origin: 'Sénégal'
      },
      quantity: 1
    });

    if (result.isValid) {
      console.log('Article ajouté avec succès !');
    } else {
      console.log('Erreurs:', result.errors);
    }
  };

  return (
    <div>
      <p>Articles dans le panier: {cart.itemCount}</p>
      <p>Total: {cart.total}€</p>
      <button onClick={handleAddToCart} disabled={isLoading}>
        Ajouter au panier
      </button>
    </div>
  );
};
```

### Validation personnalisée

```typescript
import { CartValidationService } from '@/services/CartValidationService';

// Validation d'un article avant ajout
const validation = CartValidationService.validateAddItem(
  item, 
  quantity, 
  currentCartItems
);

if (!validation.isValid) {
  console.log('Erreurs:', validation.errors);
  console.log('Avertissements:', validation.warnings);
}
```

## Configuration

### Seuils configurables

```typescript
// Dans CartValidationService
private static readonly MAX_QUANTITY_PER_ITEM = 10;
private static readonly MAX_ITEMS_IN_CART = 50;
private static readonly MIN_ORDER_AMOUNT = 5;
private static readonly MAX_ORDER_AMOUNT = 10000;

// Dans CartCalculationService
private static readonly FREE_SHIPPING_THRESHOLD = 50;
private static readonly STANDARD_SHIPPING_COST = 6.90;
```

### Options de livraison

```typescript
const shippingOptions = [
  {
    type: 'Standard',
    cost: 0, // Gratuit si seuil atteint
    estimatedDays: '3-5 jours',
    isRecommended: true
  },
  {
    type: 'Express',
    cost: 12.90,
    estimatedDays: '1-2 jours',
    isRecommended: false
  }
];
```

## Gestion d'erreurs

Le système gère automatiquement :

- **Erreurs de localStorage** : Fallback et nettoyage
- **Erreurs de validation** : Messages utilisateur clairs
- **Erreurs de calcul** : Valeurs par défaut sécurisées
- **Erreurs réseau** : État local préservé

## Performance

- **Chargement initial** : Panier restauré instantanément
- **Mises à jour** : Optimisées avec React hooks
- **Stockage** : Compression et versioning
- **Calculs** : Mémoïsation des valeurs coûteuses

## Tests

```typescript
// Exemple de test unitaire
describe('CartValidationService', () => {
  it('should validate quantity limits', () => {
    const result = CartValidationService.validateAddItem(
      mockItem, 
      15, // Quantité excessive
      []
    );
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('La quantité maximale par article est de 10');
  });
});
```

## Évolutions futures

- [ ] Synchronisation avec le backend
- [ ] Gestion des coupons et réductions
- [ ] Sauvegarde cloud
- [ ] Analytics avancés
- [ ] Mode hors ligne complet

## Support

Pour toute question ou amélioration, consultez la documentation TypeScript ou contactez l'équipe de développement. 