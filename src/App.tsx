import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './infrastructure/providers/AuthProvider';
import { ProductProvider } from './infrastructure/providers/ProductProvider';
import { CartProvider } from './infrastructure/providers/CartProvider';
import { OrderProvider } from './infrastructure/providers/OrderProvider';
import { LoginPage } from './adapters/inbound/ui/pages/LoginPage';
import { SignUpPage } from './adapters/inbound/ui/pages/SignUpPage';
import { HomePage } from './adapters/inbound/ui/pages/HomePage';
import { ProductDetailPage } from './adapters/inbound/ui/pages/ProductDetailPage';
import { CartPage } from './adapters/inbound/ui/pages/CartPage';
import { OrdersPage } from './adapters/inbound/ui/pages/OrdersPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider> {/* ← Ajouter */}
              <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={3000}
              />

              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <ProtectedRoute>
                      <ProductDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
