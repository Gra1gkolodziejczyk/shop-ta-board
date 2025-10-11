import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAdmin } from '@/infrastructure/providers/AdminProvider';
import type { Product } from '@/domain/entities/Product';
import { ProductTable } from '../components/admin/ProductTable';
import { ProductFormDialog } from '../components/admin/ProductFormDialog';
import { StockUpdateDialog } from '../components/admin/StockUpdateDialog';
import { DeleteProductDialog } from '../components/admin/DeleteProductDialog';
import { Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loading } from "@/adapters/inbound/ui/common/Loading.tsx";
import type { CreateProductData, UpdateProductData } from "@/domain/ports/outbound/AdminPort.ts";
import AdminHeader from "@/adapters/inbound/ui/layout/AdminHeader.tsx";

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  } = useAdmin();

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDialog(true);
  };

  const handleUpdateStockOpen = (product: Product) => {
    setSelectedProduct(product);
    setShowStockDialog(true);
  };

  const handleDeleteOpen = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const handleProductSubmit = async (data: CreateProductData) => {
    try {
      setIsSubmitting(true);

      if (selectedProduct) {
        const updateData: UpdateProductData = data;
        await updateProduct(selectedProduct.id, updateData);
        toast.success('Produit modifié', {
          description: 'Le produit a été mis à jour avec succès',
        });
      } else {
        await createProduct(data);
        toast.success('Produit créé', {
          description: 'Le nouveau produit a été ajouté au catalogue',
        });
      }

      setShowProductDialog(false);
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStockSubmit = async (quantity: number) => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      const newStock = selectedProduct.stock + quantity;
      await updateProduct(selectedProduct.id, { stock: newStock });

      toast.success('Stock mis à jour', {
        description: `${quantity} unité(s) ajoutée(s) au stock`,
      });

      setShowStockDialog(false);
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      await deleteProduct(selectedProduct.id);

      toast.success('Produit supprimé', {
        description: 'Le produit a été supprimé du catalogue',
      });

      setShowDeleteDialog(false);
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-gray-900 mr-3" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Gestion des produits</h2>
              <p className="text-gray-600 mt-1">
                {products.length} produit{products.length > 1 ? 's' : ''} au catalogue
              </p>
            </div>
          </div>

          <Button onClick={handleCreateProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
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

        {isLoading && products.length === 0 ? (
          <Loading />
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={handleDeleteOpen}
            onUpdateStock={handleUpdateStockOpen}
          />
        )}

        <ProductFormDialog
          open={showProductDialog}
          onOpenChange={setShowProductDialog}
          product={selectedProduct}
          onSubmit={handleProductSubmit}
          isLoading={isSubmitting}
        />

        <StockUpdateDialog
          open={showStockDialog}
          onOpenChange={setShowStockDialog}
          product={selectedProduct}
          onSubmit={handleStockSubmit}
          isLoading={isSubmitting}
        />

        <DeleteProductDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          product={selectedProduct}
          onConfirm={handleDeleteConfirm}
          isLoading={isSubmitting}
        />
      </main>
    </div>
  );
};
