import type { Product, ProductCategory } from '../../entities/Product';

export interface ProductPort {
  getAllProducts(category?: ProductCategory): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
}
