import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Header } from '../layout/Header';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { useCart } from '@/infrastructure/providers/CartProvider';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {Button} from "@/components/ui/button.tsx";
import { Loading } from "@/adapters/inbound/ui/common/Loading.tsx";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading, error, checkout, clearError } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const result = await checkout();

      toast.success('Commande confirmée ! 🎉', {
        description: `Votre commande #${result.orderId.substring(0, 8)} a été enregistrée`,
        duration: 5000,
        action: {
          label: 'Voir mes commandes',
          onClick: () => navigate('/orders'),
        },
      });

      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch {
      toast.error('Erreur lors de la commande', {
        description: 'Veuillez réessayer plus tard',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading && !cart) {
    return (
      <Loading />
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer text-gray-600 hover:text-gray-900 flex items-center mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continuer mes achats
        </button>

        <div className="flex items-center mb-8">
          <ShoppingCart className="w-8 h-8 text-gray-900 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
          {cart && cart.totalItems > 0 && (
            <span className="ml-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {cart.totalItems} {cart.totalItems > 1 ? 'articles' : 'article'}
            </span>
          )}
        </div>

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
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-6">
              Découvrez nos produits et ajoutez vos articles préférés !
            </p>
            <Button
              onClick={() => navigate('/')}
              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                cart={cart}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
