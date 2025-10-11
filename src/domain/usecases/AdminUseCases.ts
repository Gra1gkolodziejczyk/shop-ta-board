import type { AdminPort, AdminLoginData, CreateProductData, UpdateProductData } from '../ports/outbound/AdminPort';
import type { Product } from '../entities/Product';

export class AdminUseCases {
  constructor(private adminPort: AdminPort) {}

  async login(data: AdminLoginData) {
    if (!data.email || !data.password) {
      throw new Error('Email et mot de passe requis');
    }
    return await this.adminPort.login(data);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.adminPort.getAllProducts();
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    // Validations
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Le nom du produit doit contenir au moins 2 caractères');
    }
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }
    if (data.price <= 0) {
      throw new Error('Le prix doit être supérieur à 0');
    }
    if (data.stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }
    return await this.adminPort.createProduct(data);
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    if (!id) {
      throw new Error('ID du produit requis');
    }
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('Le prix doit être supérieur à 0');
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('Le stock ne peut pas être négatif');
    }
    return await this.adminPort.updateProduct(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID du produit requis');
    }
    await this.adminPort.deleteProduct(id);
  }
}
