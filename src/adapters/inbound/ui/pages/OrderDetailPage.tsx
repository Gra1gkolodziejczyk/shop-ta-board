import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../layout/Header';
import { type Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/domain/entities/Order';
import { useOrders } from '@/infrastructure/providers/OrderProvider';
import {
  Package,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Loading} from "@/adapters/inbound/ui/common/Loading.tsx";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, error: ordersError } = useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const fetchedOrder = await getOrderById(id);
        setOrder(fetchedOrder);
      } catch {
        toast.error('Erreur', {
          description: 'Impossible de charger la commande',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, getOrderById]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertDescription>Commande introuvable</AlertDescription>
          </Alert>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 text-blue-600 hover:text-blue-700 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalItems = order.totalItems || order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/orders')}
          className="cursor-pointer text-gray-600 hover:text-gray-900 flex items-center mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux commandes
        </button>

        {ordersError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{ordersError}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 md:p-8 text-white mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Commande #{order.id.substring(0, 8)}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white text-opacity-90">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>{totalItems} article{totalItems > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
             <span className={`px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
               {ORDER_STATUS_LABELS[order.status]}
             </span>
              <span className="text-3xl md:text-4xl font-bold">
                {order.totalAmount.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-400" />
                Produits commandés
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{item.productBrand}</p>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantité: <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Prix unitaire: <span className="font-medium">{item.unitPrice.toFixed(2)} €</span>
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {item.subtotal.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-gray-400" />
                Statut de la commande
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statut actuel</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <p className="text-xs text-gray-500">
                    Commandé le {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-400" />
                Résumé
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total ({totalItems} articles)</span>
                  <span className="font-medium text-gray-900">
                    {order.totalAmount.toFixed(2)} €
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {order.totalAmount.toFixed(2)} €
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Référence commande</p>
                <p className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded break-all">
                  {order.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
