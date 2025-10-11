import type { User } from '../../entities/User';
import type { Tokens } from '../../entities/Tokens';

export interface SignUpData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthPort {
  signUp(data: SignUpData): Promise<Tokens>;
  signIn(data: SignInData): Promise<Tokens>;
  signOut(accessToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<Tokens>;
  getCurrentUser(accessToken: string): Promise<User>;
}
