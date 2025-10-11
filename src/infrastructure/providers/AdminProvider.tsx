import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Product } from '@/domain/entities/Product';
import { AdminUseCases } from '@/domain/usecases/AdminUseCases';
import { AdminApiAdapter } from '@/adapters/outbound/api/AdminApiAdapter';
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter';
import type { AdminLoginData, CreateProductData, UpdateProductData } from '@/domain/ports/outbound/AdminPort';

interface AdminContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (data: AdminLoginData) => Promise<void>;
  fetchProducts: () => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<void>;
  updateProduct: (id: string, data: UpdateProductData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const tokenStorage = new TokenStorageAdapter();
const adminApiAdapter = new AdminApiAdapter(() => tokenStorage.getAccessToken());
const adminUseCases = new AdminUseCases(adminApiAdapter);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback(async (data: AdminLoginData) => {
    try {
      setError(null);
      setIsLoading(true);
      const tokens = await adminUseCases.login(data);

      // Remplacer le token utilisateur par le token admin
      tokenStorage.saveTokens(tokens);
      setIsAdmin(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion admin');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedProducts = await adminUseCases.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: CreateProductData) => {
    try {
      setError(null);
      setIsLoading(true);
      await adminUseCases.createProduct(data);
      await fetchProducts(); // Recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du produit');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, data: UpdateProductData) => {
    try {
      setError(null);
      await adminUseCases.updateProduct(id, data);
      await fetchProducts(); // Recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du produit');
      throw err;
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      setError(null);
      await adminUseCases.deleteProduct(id);
      await fetchProducts(); // Recharger la liste
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du produit');
      throw err;
    }
  }, [fetchProducts]);

  const clearError = () => setError(null);

  return (
    <AdminContext.Provider
      value={{
        products,
        isLoading,
        error,
        isAdmin,
        login,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
