import React, { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react';
import type { Cart } from '@/domain/entities/Cart.ts';
import { CartUseCases } from '@/domain/usecases/CartUseCases.ts';
import { CartApiAdapter } from '@/adapters/outbound/api/CartApiAdapter.ts';
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter.ts';
import type { AddToCartData, UpdateCartItemData } from '@/domain/ports/outbound/CartPort.ts';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (data: AddToCartData) => Promise<void>;
  updateCartItem: (itemId: string, data: UpdateCartItemData) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<{ message: string; orderId: string }>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const tokenStorage = new TokenStorageAdapter();
const cartApiAdapter = new CartApiAdapter(() => tokenStorage.getAccessToken());
const cartUseCases = new CartUseCases(cartApiAdapter);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedCart = await cartUseCases.getCart();
      setCart(fetchedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du panier');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (data: AddToCartData) => {
    try {
      setError(null);
      setIsLoading(true);
      const updatedCart = await cartUseCases.addToCart(data);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout au panier');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async (itemId: string, data: UpdateCartItemData) => {
    try {
      setError(null);
      const updatedCart = await cartUseCases.updateCartItem(itemId, data);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, []);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setError(null);
      const updatedCart = await cartUseCases.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      setError(null);
      await cartUseCases.clearCart();
      setCart(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du vidage du panier');
      throw err;
    }
  }, []);

  const checkout = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const result = await cartUseCases.checkout();
      setCart(null); // Vider le panier après le checkout
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la commande');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  // Charger le panier au montage
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        checkout,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
