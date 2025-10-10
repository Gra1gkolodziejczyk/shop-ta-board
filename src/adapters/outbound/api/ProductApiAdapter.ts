import type { ProductPort } from '@/domain/ports/outbound/ProductPort.ts';
import type { Product, ProductCategory } from '@/domain/entities/Product.ts';
import { HttpClient } from '../http/httpClient';
import { API_CONFIG } from '@/infrastructure/config.ts';

export class ProductApiAdapter implements ProductPort {
  private httpClient: HttpClient;

  constructor(private getAccessToken: () => string | null) {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  async getAllProducts(category?: ProductCategory): Promise<Product[]> {
    try {
      const token = this.getAccessToken();

      if (!token) {
        throw new Error('Non authentifié - Token manquant');
      }

      const endpoint = category
        ? `${API_CONFIG.ENDPOINTS.PRODUCTS.GET_ALL}?category=${category}`
        : API_CONFIG.ENDPOINTS.PRODUCTS.GET_ALL;

      return await this.httpClient.get<Product[]>(endpoint, token);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la récupération des produits'
      );
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const token = this.getAccessToken();

      if (!token) {
        throw new Error('Non authentifié - Token manquant');
      }

      return await this.httpClient.get<Product>(
        API_CONFIG.ENDPOINTS.PRODUCTS.GET_BY_ID(id),
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Produit introuvable'
      );
    }
  }
}
