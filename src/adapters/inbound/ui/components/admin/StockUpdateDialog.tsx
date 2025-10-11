import React, { useState, useEffect } from 'react';
import type { Product } from '@/domain/entities/Product';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StockUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: (quantity: number) => Promise<void>;
  isLoading: boolean;
}

export const StockUpdateDialog: React.FC<StockUpdateDialogProps> = ({open, onOpenChange, product, onSubmit, isLoading}) => {
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (open) {
      setQuantity('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (qty > 0) {
      await onSubmit(qty);
    }
  };

  if (!product) return null;

  const newStock = product.stock + (parseInt(quantity) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter du stock</DialogTitle>
          <DialogDescription>
            {product.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Stock actuel</span>
                <span className="text-2xl font-bold text-gray-900">
                  {product.stock}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité à ajouter *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="10"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            {quantity && parseInt(quantity) > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Nouveau stock</span>
                  <span className="text-2xl font-bold text-blue-900">
                    {newStock}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button className="cursor-pointer" type="submit" disabled={isLoading || !quantity || parseInt(quantity) <= 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
