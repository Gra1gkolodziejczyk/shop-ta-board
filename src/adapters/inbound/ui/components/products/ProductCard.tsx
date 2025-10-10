import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Product, CATEGORY_LABELS } from '@/domain/entities/Product';
import { ShoppingCart, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          {CATEGORY_LABELS[product.category]}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {product.price.toFixed(2)} €
          </span>
        </div>

        <div className="flex items-center mb-4">
          <Package className="w-4 h-4 text-gray-400 mr-1.5" />
          <span className="text-sm text-gray-500">{product.stock} en stock</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`
           cursor-pointer w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center
            ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }
          `}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
};
