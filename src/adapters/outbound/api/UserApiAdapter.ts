import type { UserPort, UpdateUserData } from '@/domain/ports/outbound/UserPort';
import type { User } from '@/domain/entities/User';
import { HttpClient } from '../http/httpClient';
import { API_CONFIG } from '@/infrastructure/config';

export class UserApiAdapter implements UserPort {
  private httpClient: HttpClient;

  constructor(private getAccessToken: () => string | null) {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  async updateUser(data: UpdateUserData): Promise<User> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      return await this.httpClient.patch<User>(
        API_CONFIG.ENDPOINTS.USERS.UPDATE,
        data,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'
      );
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      await this.httpClient.delete<void>(
        API_CONFIG.ENDPOINTS.USERS.DELETE,
        token
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Erreur lors de la suppression du compte'
      );
    }
  }
}
