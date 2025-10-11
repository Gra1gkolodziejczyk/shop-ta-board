import type { AuthPort, SignUpData, SignInData } from '../ports/outbound/AuthPort';
import type { AuthUseCasesPort } from '../ports/inbound/AuthUseCasesPort';
import type { Tokens } from '../entities/Tokens';
import type { User } from '../entities/User';

export class AuthUseCases implements AuthUseCasesPort {
  constructor(private authPort: AuthPort) {}

  async signUp(data: SignUpData): Promise<Tokens> {
    if (data.password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!data.email.includes('@')) {
      throw new Error('Email invalide');
    }

    if (data.firstname.trim().length < 2) {
      throw new Error('Le prénom doit contenir au moins 2 caractères');
    }

    if (data.lastname.trim().length < 2) {
      throw new Error('Le nom doit contenir au moins 2 caractères');
    }

    return await this.authPort.signUp(data);
  }

  async signIn(data: SignInData): Promise<Tokens> {
    if (!data.email || !data.password) {
      throw new Error('Email et mot de passe requis');
    }

    return await this.authPort.signIn(data);
  }

  async signOut(accessToken: string): Promise<void> {
    if (!accessToken) {
      throw new Error('Token requis pour la déconnexion');
    }

    await this.authPort.signOut(accessToken);
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new Error('Refresh token requis');
    }

    return await this.authPort.refreshToken(refreshToken);
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    return await this.authPort.getCurrentUser(accessToken);
  }
}
