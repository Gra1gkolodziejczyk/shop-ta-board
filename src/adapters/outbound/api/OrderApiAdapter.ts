import type { OrderPort } from '@/domain/ports/outbound/OrderPort';
import type { Order } from '@/domain/entities/Order';
import { HttpClient } from '../http/httpClient';
import { API_CONFIG } from '@/infrastructure/config';

export class OrderApiAdapter implements OrderPort {
  private httpClient: HttpClient;

  constructor(private getAccessToken: () => string | null) {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.get<Order[]>(API_CONFIG.ENDPOINTS.ORDERS.GET_ALL, token);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la récupération des commandes'
      );
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.get<Order>(
        API_CONFIG.ENDPOINTS.ORDERS.GET_BY_ID(id),
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Commande introuvable'
      );
    }
  }
}
