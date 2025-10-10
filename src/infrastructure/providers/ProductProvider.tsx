import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Product, ProductCategory } from '@/domain/entities/Product.ts';
import { ProductUseCases } from '@/domain/usecases/ProductUseCases.ts';
import { ProductApiAdapter } from '@/adapters/outbound/api/ProductApiAdapter.ts';
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter.ts';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: ProductCategory | null;
  fetchProducts: (category?: ProductCategory) => Promise<void>;
  setSelectedCategory: (category: ProductCategory | null) => void;
  clearError: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Instancier UNIQUEMENT le tokenStorage
const tokenStorage = new TokenStorageAdapter();

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  // ⬇️ Créer les instances ICI avec une fonction qui récupère le token
  const productApiAdapter = new ProductApiAdapter(() => {
    const token = tokenStorage.getAccessToken();
    return token;
  });
  const productUseCases = new ProductUseCases(productApiAdapter);

  const fetchProducts = useCallback(async (category?: ProductCategory) => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedProducts = await productUseCases.getAllProducts(category);
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetCategory = useCallback((category: ProductCategory | null) => {
    setSelectedCategory(category);
    fetchProducts(category || undefined);
  }, [fetchProducts]);

  const clearError = () => setError(null);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        selectedCategory,
        fetchProducts,
        setSelectedCategory: handleSetCategory,
        clearError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
