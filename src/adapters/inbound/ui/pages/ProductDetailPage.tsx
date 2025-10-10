import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type Product, CATEGORY_LABELS } from '@/domain/entities/Product';
import { useProducts } from '@/infrastructure/providers/ProductProvider';
import {
  ShoppingCart,
  Package,
  ArrowLeft,
  Minus,
  Plus,
  Loader2,
  Check,
  Tag
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from "@/adapters/inbound/ui/layout/Header.tsx";
import { TokenStorageAdapter } from '@/adapters/outbound/api/TokenStorageAdapter.ts';
import { ProductApiAdapter } from '@/adapters/outbound/api/ProductApiAdapter.ts';
import { ProductUseCases } from '@/domain/usecases/ProductUseCases.ts';
import ProductNotFound from "@/adapters/inbound/ui/components/products/ProductNotFound.tsx";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { error } = useProducts();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);

        // ⬇️ Créer une instance temporaire pour récupérer le produit
        const tokenStorage = new TokenStorageAdapter();
        const productApiAdapter = new ProductApiAdapter(() => tokenStorage.getAccessToken());
        const productUseCases = new ProductUseCases(productApiAdapter);

        const fetchedProduct = await productUseCases.getProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    if (!product) return;

    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implémenter l'ajout au panier
    console.log(`Ajouter ${quantity}x ${product?.name} au panier`);
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <ProductNotFound />
  }

  const isOutOfStock = product.stock === 0;
  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux produits
        </button>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {addedToCart && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              Produit ajouté au panier avec succès !
            </AlertDescription>
          </Alert>
        )}

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">Rupture de stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {CATEGORY_LABELS[product.category]}
                </span>
              </div>

              {/* Brand */}
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {product.price.toFixed(2)} €
                </span>
              </div>

              {/* Stock */}
              <div className="flex items-center mb-6">
                <Package className="w-5 h-5 text-gray-400 mr-2" />
                <span className={`text-sm font-medium ${
                  product.stock > 10
                    ? 'text-green-600'
                    : product.stock > 0
                      ? 'text-orange-600'
                      : 'text-red-600'
                }`}>
                  {product.stock > 0
                    ? `${product.stock} en stock`
                    : 'Rupture de stock'}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-xl font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    <span className="text-sm text-gray-500 ml-4">
                      Total: <span className="font-bold text-gray-900">{totalPrice.toFixed(2)} €</span>
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addedToCart}
                className={`
                  w-full py-4 px-6 rounded-lg font-semibold text-lg
                  flex items-center justify-center space-x-2
                  transition-all duration-200
                  ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }
                `}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Ajouté au panier</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}</span>
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 w-32">Marque:</span>
                    <span>{product.brand}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 w-32">Catégorie:</span>
                    <span>{CATEGORY_LABELS[product.category]}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 w-32">Référence:</span>
                    <span className="font-mono text-xs">{product.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
