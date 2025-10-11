import React, { useEffect } from 'react';
import { Header } from '../layout/Header';
import { CategoryFilter } from '../components/products/CategoryFilter';
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '@/infrastructure/providers/ProductProvider.tsx';
import type { Product } from '@/domain/entities/Product.ts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from "@/infrastructure/providers/CartProvider.tsx";
import { toast } from "sonner";

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
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({ productId: product.id, quantity: 1 });

      toast.success('Produit ajouté au panier', {
        description: `${product.name} a été ajouté à votre panier`,
        action: {
          label: 'Voir le panier',
          onClick: () => window.location.href = '/cart',
        },
      });
    } catch {
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter le produit au panier',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
