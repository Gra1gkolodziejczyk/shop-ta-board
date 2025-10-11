import React from 'react';
import type { Product } from '@/domain/entities/Product';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
                                                                          open,
                                                                          onOpenChange,
                                                                          product,
                                                                          onConfirm,
                                                                          isLoading,
                                                                        }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Supprimer ce produit ?
          </DialogTitle>
          <DialogDescription className="text-base pt-4">
            Êtes-vous sûr de vouloir supprimer ce produit ?
            <br />
            <br />
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
            </div>
            <br />
            <span className="font-semibold text-red-600">
              Cette action est irréversible.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer définitivement'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
