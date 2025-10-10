import type { CartPort, AddToCartData, UpdateCartItemData } from '@/domain/ports/outbound/CartPort.ts';
import type { Cart } from '@/domain/entities/Cart.ts';
import { HttpClient } from '../http/httpClient';
import { API_CONFIG } from '@/infrastructure/config.ts';

export class CartApiAdapter implements CartPort {
  private httpClient: HttpClient;

  constructor(private getAccessToken: () => string | null) {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  async getCart(): Promise<Cart> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.get<Cart>(API_CONFIG.ENDPOINTS.CART.GET, token);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la récupération du panier'
      );
    }
  }

  async addToCart(data: AddToCartData): Promise<Cart> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.post<Cart>(
        API_CONFIG.ENDPOINTS.CART.ADD_ITEM,
        data,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de l\'ajout au panier'
      );
    }
  }

  async updateCartItem(itemId: string, data: UpdateCartItemData): Promise<Cart> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.patch<Cart>(
        API_CONFIG.ENDPOINTS.CART.UPDATE_ITEM(itemId),
        data,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour'
      );
    }
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.delete<Cart>(
        API_CONFIG.ENDPOINTS.CART.REMOVE_ITEM(itemId),
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la suppression'
      );
    }
  }

  async clearCart(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      await this.httpClient.delete<void>(API_CONFIG.ENDPOINTS.CART.CLEAR, token);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors du vidage du panier'
      );
    }
  }

  async checkout(): Promise<{ message: string; orderId: string }> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.post<{ message: string; orderId: string }>(
        API_CONFIG.ENDPOINTS.CART.CHECKOUT,
        undefined,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la commande'
      );
    }
  }
}
