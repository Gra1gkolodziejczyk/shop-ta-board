import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/domain/entities/Order';
import { Package, Calendar, ChevronRight } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Commande #{order.id.substring(0, 8)}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <Package className="w-4 h-4 mr-1.5 text-gray-400" />
            <span className="font-medium">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-gray-900 mb-2">
            {order.totalAmount.toFixed(2)} €
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      <div className="flex -space-x-2">
        {order.items.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 overflow-hidden"
          >
            <img
              src={item.productImage}
              alt={item.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/50x50?text=No+Image';
              }}
            />
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">
              +{order.items.length - 3}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
