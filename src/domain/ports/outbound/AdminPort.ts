import type { Product, ProductCategory } from '../../entities/Product';

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminTokens {
  access_token: string;
  refresh_token: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  category?: ProductCategory;
  brand?: string;
  price?: number;
  imageUrl?: string;
  stock?: number;
}

export interface AdminPort {
  login(data: AdminLoginData): Promise<AdminTokens>;
  getAllProducts(): Promise<Product[]>;
  createProduct(data: CreateProductData): Promise<Product>;
  updateProduct(id: string, data: UpdateProductData): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
