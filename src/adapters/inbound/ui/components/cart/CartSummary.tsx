import React from 'react';
import type { Cart } from '@/domain/entities/Cart';
import { ShoppingBag } from 'lucide-react';

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, onCheckout, isCheckingOut }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Articles ({cart.totalItems})</span>
          <span className="font-medium text-gray-900">{cart.totalAmount.toFixed(2)} €</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Livraison</span>
          <span className="font-medium text-green-600">Gratuite</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              {cart.totalAmount.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckingOut || cart.items.length === 0}
        className="cursor-pointer w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isCheckingOut ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Traitement en cours...
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Passer la commande
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Paiement sécurisé • Livraison gratuite
      </p>
    </div>
  );
};
