import type { OrderPort } from '../ports/outbound/OrderPort';
import type { Order } from '../entities/Order';

export class OrderUseCases {
  constructor(private orderPort: OrderPort) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.orderPort.getAllOrders();
  }

  async getOrderById(id: string): Promise<Order> {
    if (!id) {
      throw new Error('ID de la commande requis');
    }
    return await this.orderPort.getOrderById(id);
  }
}
