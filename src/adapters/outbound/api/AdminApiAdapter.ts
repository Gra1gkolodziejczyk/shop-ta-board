import type {
  AdminPort,
  AdminLoginData,
  AdminTokens,
  CreateProductData,
  UpdateProductData,
} from '@/domain/ports/outbound/AdminPort';
import type { Product } from '@/domain/entities/Product';
import { HttpClient } from '../http/httpClient';
import { API_CONFIG } from '@/infrastructure/config';

export class AdminApiAdapter implements AdminPort {
  private httpClient: HttpClient;

  constructor(private getAccessToken: () => string | null) {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  async login(data: AdminLoginData): Promise<AdminTokens> {
    try {
      return await this.httpClient.post<AdminTokens>(
        API_CONFIG.ENDPOINTS.ADMIN.LOGIN,
        data
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Identifiants incorrects'
      );
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.get<Product[]>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS.GET_ALL,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la récupération des produits'
      );
    }
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.post<Product>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS.CREATE,
        data,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la création du produit'
      );
    }
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.patch<Product>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS.UPDATE(id),
        data,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du produit'
      );
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      await this.httpClient.delete<void>(
        API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS.DELETE(id),
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la suppression du produit'
      );
    }
  }
}
