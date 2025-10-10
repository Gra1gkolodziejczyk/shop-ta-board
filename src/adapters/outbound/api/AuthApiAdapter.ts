import type { AuthPort, SignUpData, SignInData } from '@/domain/ports/outbound/AuthPort.ts';
import type { User } from '@/domain/entities/User.ts';
import type { Tokens } from '@/domain/entities/Tokens.ts';
import { HttpClient } from '../http/httpClient';
import { API_CONFIG } from '@/infrastructure/config.ts';

export class AuthApiAdapter implements AuthPort {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(API_CONFIG.BASE_URL);
  }

  async signUp(data: SignUpData): Promise<Tokens> {
    try {
      return await this.httpClient.post<Tokens>(
        API_CONFIG.ENDPOINTS.AUTH.SIGN_UP,
        data
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription');
    }
  }

  async signIn(data: SignInData): Promise<Tokens> {
    try {
      const tokens = await this.httpClient.post<Tokens>(
        API_CONFIG.ENDPOINTS.AUTH.SIGN_IN,
        data
      );
      return tokens;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Email ou mot de passe incorrect');
    }
  }

  async signOut(accessToken: string): Promise<void> {
    try {
      await this.httpClient.post<void>(
        API_CONFIG.ENDPOINTS.AUTH.SIGN_OUT,
        undefined,
        accessToken
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Erreur lors de la déconnexion');
    }
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    try {
      return await this.httpClient.post<Tokens>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        undefined,
        refreshToken
      );
    } catch {
      throw new Error('Session expirée, veuillez vous reconnecter');
    }
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    try {
      const user = await this.httpClient.get<User>(
        API_CONFIG.ENDPOINTS.AUTH.ME,
        accessToken
      );
      return user;
    } catch {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }
  }
}
