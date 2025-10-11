export enum ProductCategory {
  WHEEL = 'wheel',
  BOARD = 'board',
  SCREW = 'screw',
  TRUCK = 'truck',
  GRIP = 'grip',
  BACKPACK = 'backpack',
  CLOTHES = 'clothes',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.WHEEL]: 'Roues',
  [ProductCategory.BOARD]: 'Planches',
  [ProductCategory.SCREW]: 'Visserie',
  [ProductCategory.TRUCK]: 'Trucks',
  [ProductCategory.GRIP]: 'Grip Tape',
  [ProductCategory.BACKPACK]: 'Sacs',
  [ProductCategory.CLOTHES]: 'Vêtements',
};
