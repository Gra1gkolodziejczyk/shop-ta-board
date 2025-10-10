
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}
