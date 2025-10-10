import React, { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Order } from '@/domain/entities/Order';
import { OrderUseCases } from '@/domain/usecases/OrderUseCases';
import { OrderApiAdapter } from '@/adapters/outbound/api/OrderApiAdapter';
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const tokenStorage = new TokenStorageAdapter();
const orderApiAdapter = new OrderApiAdapter(() => tokenStorage.getAccessToken());
const orderUseCases = new OrderUseCases(orderApiAdapter);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedOrders = await orderUseCases.getAllOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string): Promise<Order> => {
    try {
      setError(null);
      return await orderUseCases.getOrderById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Commande introuvable');
      throw err;
    }
  }, []);

  const clearError = () => setError(null);

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        fetchOrders,
        getOrderById,
        clearError,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
