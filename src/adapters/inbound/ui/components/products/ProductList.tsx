import React from 'react';
import type { Product } from '@/domain/entities/Product';
import { ProductCard } from './ProductCard';
import {Loading} from "@/adapters/inbound/ui/common/Loading.tsx";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({products, isLoading, onAddToCart}) => {
  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
