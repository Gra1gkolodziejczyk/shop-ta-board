import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '@/infrastructure/providers/CartProvider';
import { Avatar } from '../common/Avatar';
import { LogOut, User, ShoppingCart, Menu, X, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { cart } = useCart();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!user) return null;

  const cartItemsCount = cart?.totalItems || 0;

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Produits', icon: null },
    { path: '/cart', label: 'Panier', icon: ShoppingCart, badge: cartItemsCount },
    { path: '/orders', label: 'Mes commandes', icon: Package },
  ];

  const handleMobileMenuClose = () => {
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleMobileMenuClose}
          >
            <div className="text-2xl">🛹</div>
            <span className="text-xl font-bold text-gray-900">Shop Ta Board</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative px-3 py-2 text-sm font-medium transition-colors flex items-center group
                    ${
                    isActive(link.path)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }
                  `}
                >
                  {Icon && <Icon className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />}
                  <span>{link.label}</span>

                  {/* Badge */}
                  {link.badge && link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Menu Desktop */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 focus:outline-none hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-medium text-gray-700">
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
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {/* Cart badge visible on mobile */}
            {cartItemsCount > 0 && (
              <Link to="/cart" className="relative" onClick={handleMobileMenuClose}>
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              </Link>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t py-4 space-y-2 animate-in slide-in-from-top duration-200">
            {/* Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleMobileMenuClose}
                  className={`
                    relative flex items-center px-4 py-3 rounded-lg transition-colors
                    ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                  `}
                >
                  {Icon && <Icon className="w-5 h-5 mr-3" />}
                  <span className="font-medium">{link.label}</span>

                  {link.badge && link.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* User Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center px-4 py-2 mb-2">
                <Avatar firstname={user.firstname} lastname={user.lastname} size="md" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstname} {user.lastname}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={handleMobileMenuClose}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 mr-3" />
                <span className="font-medium">Mon profil</span>
              </Link>

              <button
                onClick={() => {
                  handleMobileMenuClose();
                  signOut();
                }}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
