import React from 'react';
import { type Order } from '@/domain/entities/Order';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({order, open, onOpenChange}) => {
  if (!order) return null;

  console.log('🔍 OrderDetailModal rendered with order:', order.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Commande #{order.id.substring(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>Total: {order.totalAmount.toFixed(2)} €</p>
          <p>Articles: {order.items.length}</p>

          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded"
          >
            Fermer
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
