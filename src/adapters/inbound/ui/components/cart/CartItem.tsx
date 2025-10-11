import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CartItem as CartItemType } from '@/domain/entities/Cart';
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react';
import { useCart } from '@/infrastructure/providers/CartProvider';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const navigate = useNavigate();
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }

    try {
      setIsUpdating(true);
      await updateCartItem(item.id, { quantity: newQuantity });
    } catch (err) {
      console.error('Erreur mise à jour quantité:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeFromCart(item.id);
    } catch (err) {
      console.error('Erreur suppression:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleNavigateToProduct = () => {
    navigate(`/products/${item.productId}`);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div
        onClick={handleNavigateToProduct}
        className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
      >
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{item.productBrand}</p>
        <h3
          onClick={handleNavigateToProduct}
          className="text-base font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors line-clamp-1"
        >
          {item.productName}
        </h3>
        <p className="text-lg font-bold text-gray-900 mb-3">
          {item.productPrice.toFixed(2)} €
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || isRemoving}
            className="cursor-pointer w-8 h-8 rounded-md border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating && item.quantity > 1 ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </button>

          <span className="text-base font-semibold min-w-[2rem] text-center">
            {item.quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating || isRemoving}
            className="cursor-pointer w-8 h-8 rounded-md border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating && item.quantity < 99 ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleRemove}
            disabled={isRemoving || isUpdating}
            className="cursor-pointer ml-auto p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className="text-sm text-gray-500 mb-1">Sous-total</p>
        <p className="text-xl font-bold text-gray-900">
          {item.subtotal.toFixed(2)} €
        </p>
      </div>
    </div>
  );
};
