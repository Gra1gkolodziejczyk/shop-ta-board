import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '@/infrastructure/providers/CartProvider.tsx';
import { Avatar } from '../common/Avatar';
import { LogOut, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const cartItemsCount = cart?.totalItems || 0;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="cursor-pointer flex items-center space-x-2">
            <div className="text-2xl">🛹</div>
            <span className="text-xl font-bold text-gray-900">Shop Ta Board</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="cursor-pointer text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Produits
            </Link>

            <Link
              to="/cart"
              className="cursor-pointer relative text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center group"
            >
              <ShoppingCart className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
              <span>Panier</span>

              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in duration-200">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              className="cursor-pointer text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
            >
              Mes commandes
            </Link>
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer flex items-center space-x-3 focus:outline-none"
            >
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user.firstname} {user.lastname}
              </span>
              <Avatar firstname={user.firstname} lastname={user.lastname} size="md" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstname} {user.lastname}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon profil
                  </Link>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      signOut();
                    }}
                    className="cursor-pointer w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
