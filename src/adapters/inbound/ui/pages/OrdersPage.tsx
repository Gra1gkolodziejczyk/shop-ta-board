import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../layout/Header';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { useOrders } from '@/infrastructure/providers/OrderProvider';
import type { Order } from '@/domain/entities/Order';
import { Package, ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, isLoading, error, fetchOrders, getOrderById, clearError } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderClick = async (orderId: string) => {
    console.log('🎯 Click on order:', orderId);

    try {
      setIsLoadingDetail(true);
      console.log('⏳ Loading order detail...');

      const orderDetail = await getOrderById(orderId);
      console.log('✅ Order detail loaded:', orderDetail);

      setSelectedOrder(orderDetail);
      setIsDialogOpen(true);
      console.log('🚀 Dialog should open now');
    } catch (err) {
      console.error('❌ Error loading order detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Petit délai avant de nettoyer pour l'animation de fermeture
      setTimeout(() => {
        setSelectedOrder(null);
      }, 200);
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement des commandes...</span>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = orders.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux produits
        </button>

        {/* Title */}
        <div className="flex items-center mb-8">
          <Package className="w-8 h-8 text-gray-900 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          {orders.length > 0 && (
            <span className="ml-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {orders.length} commande{orders.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex justify-between items-center">
              {error}
              <button
                onClick={clearError}
                className="text-sm underline hover:no-underline"
              >
                Fermer
              </button>
            </AlertDescription>
          </Alert>
        )}

        {isEmpty ? (
          /* No Orders */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucune commande
            </h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore passé de commande
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          /* Orders List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => handleOrderClick(order.id)}
              />
            ))}
          </div>
        )}

        {/* Loading Detail Overlay */}
        {isLoadingDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex items-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
              <span className="text-gray-700">Chargement des détails...</span>
            </div>
          </div>
        )}

        {/* Order Detail Dialog */}
        <OrderDetailModal
          order={selectedOrder}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
        />
      </main>
    </div>
  );
};
