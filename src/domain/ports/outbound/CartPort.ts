import type { Cart } from '../../entities/Cart';

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartPort {
  getCart(): Promise<Cart>;
  addToCart(data: AddToCartData): Promise<Cart>;
  updateCartItem(itemId: string, data: UpdateCartItemData): Promise<Cart>;
  removeFromCart(itemId: string): Promise<Cart>;
  clearCart(): Promise<void>;
  checkout(): Promise<{ message: string; orderId: string }>;
}
