import React, { useEffect } from 'react';
import { Header } from '../layout/Header';
import { CategoryFilter } from '../components/products/CategoryFilter';
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '@/infrastructure/providers/ProductProvider.tsx';
import type { Product } from '@/domain/entities/Product.ts';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const HomePage: React.FC = () => {
  const {
    products,
    isLoading,
    error,
    selectedCategory,
    fetchProducts,
    setSelectedCategory,
    clearError,
  } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    alert(`${product.name} ajouté au panier ! (À implémenter)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛹 Bienvenue sur Shop Ta Board
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez notre sélection de skateboards et accessoires
          </p>
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

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductList
          products={products}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
        />
      </main>
    </div>
  );
};
