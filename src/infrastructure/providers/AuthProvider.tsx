import React, {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import type { User } from '@/domain/entities/User.ts';
import { AuthUseCases } from '@/domain/usecases/AuthUseCases';
import { AuthApiAdapter } from '@/adapters/outbound/api/AuthApiAdapter';
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter';
import type { SignUpData, SignInData } from '@/domain/ports/outbound/AuthPort';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Instancier les adapters et use cases
const authApiAdapter = new AuthApiAdapter();
const tokenStorage = new TokenStorageAdapter();
const authUseCases = new AuthUseCases(authApiAdapter);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = tokenStorage.getAccessToken();

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authUseCases.getCurrentUser(accessToken);
        setUser(currentUser);
      } catch {
        // Token invalide, essayer de refresh
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const newTokens = await authUseCases.refreshToken(refreshToken);
            tokenStorage.saveTokens(newTokens);
            const currentUser = await authUseCases.getCurrentUser(newTokens.access_token);
            setUser(currentUser);
          } catch {
            tokenStorage.clearTokens();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setError(null);
      setIsLoading(true);
      const tokens = await authUseCases.signUp(data);
      tokenStorage.saveTokens(tokens);
      const currentUser = await authUseCases.getCurrentUser(tokens.access_token);
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      setError(null);
      setIsLoading(true);
      const tokens = await authUseCases.signIn(data);
      tokenStorage.saveTokens(tokens);
      const currentUser = await authUseCases.getCurrentUser(tokens.access_token);
      setUser(currentUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const accessToken = tokenStorage.getAccessToken();
      if (accessToken) {
        await authUseCases.signOut(accessToken);
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
