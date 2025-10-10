import type { CartPort, AddToCartData, UpdateCartItemData } from '../ports/outbound/CartPort';
import type { Cart } from '../entities/Cart';

export class CartUseCases {
  constructor(private cartPort: CartPort) {}

  async getCart(): Promise<Cart> {
    return await this.cartPort.getCart();
  }

  async addToCart(data: AddToCartData): Promise<Cart> {
    if (!data.productId) {
      throw new Error('ID du produit requis');
    }
    if (data.quantity < 1) {
      throw new Error('La quantité doit être au moins 1');
    }
    return await this.cartPort.addToCart(data);
  }

  async updateCartItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    if (!itemId) {
      throw new Error('ID de l\'article requis');
    }
    if (data.quantity < 1) {
      throw new Error('La quantité doit être au moins 1');
    }
    return await this.cartPort.updateCartItem(itemId, data);
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    if (!itemId) {
      throw new Error('ID de l\'article requis');
    }
    return await this.cartPort.removeFromCart(itemId);
  }

  async clearCart(): Promise<void> {
    await this.cartPort.clearCart();
  }

  async checkout(): Promise<{ message: string; orderId: string }> {
    return await this.cartPort.checkout();
  }
}
