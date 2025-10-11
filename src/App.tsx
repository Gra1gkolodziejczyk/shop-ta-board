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
import { OrderDetailPage } from './adapters/inbound/ui/pages/OrderDetailPage';
import { Loading } from "@/adapters/inbound/ui/common/Loading.tsx";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Loading />
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
            <OrderProvider>
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
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
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
