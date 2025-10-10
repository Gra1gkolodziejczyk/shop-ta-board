import type { Order } from '../../entities/Order';

export interface OrderPort {
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order>;
}
