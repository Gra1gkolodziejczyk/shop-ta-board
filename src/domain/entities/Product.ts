export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly imageUrl: string,
    public readonly stock: number
  ) {}

  isAvailable(): boolean {
    return this.stock > 0;
  }

  isLowStock(): boolean {
    return this.stock > 0 && this.stock <= 5;
  }

  formatPrice(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.price);
  }
}
