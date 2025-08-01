export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  origin?: string;
  category?: string;
  maxQuantity?: number;
  available?: boolean;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  itemCount: number;
}

export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AddToCartRequest {
  item: Omit<CartItem, 'quantity'>;
  quantity: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  itemId: string;
}

export interface CartService {
  getCart(): Cart;
  addItem(request: AddToCartRequest): CartValidationResult;
  updateItem(request: UpdateCartItemRequest): CartValidationResult;
  removeItem(request: RemoveFromCartRequest): void;
  clearCart(): void;
  validateCart(): CartValidationResult;
  saveToStorage(): void;
  loadFromStorage(): void;
} 