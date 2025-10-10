import type { ProductPort } from '../ports/outbound/ProductPort';
import type { Product, ProductCategory } from '../entities/Product';

export class ProductUseCases {
  constructor(private productPort: ProductPort) {}

  async getAllProducts(category?: ProductCategory): Promise<Product[]> {
    return await this.productPort.getAllProducts(category);
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) {
      throw new Error('ID du produit requis');
    }
    return await this.productPort.getProductById(id);
  }
}
