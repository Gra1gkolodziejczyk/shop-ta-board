import type { User } from '../../entities/User';
import type { Tokens } from '../../entities/Tokens';
import type { SignUpData, SignInData } from '../outbound/AuthPort';

// Port d'entrée (interface pour les use cases)
export interface AuthUseCasesPort {
  signUp(data: SignUpData): Promise<Tokens>;
  signIn(data: SignInData): Promise<Tokens>;
  signOut(accessToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<Tokens>;
  getCurrentUser(accessToken: string): Promise<User>;
}
