import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/products', label: 'Boutique' },
    { path: '/recipes', label: 'Recettes' },
    { path: '/favorites', label: 'Favoris' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <span className="hidden sm:inline">Balsem</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => navigate('/products?search=')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              to="/profile"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mon Compte
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
