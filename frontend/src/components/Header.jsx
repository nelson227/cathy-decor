import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiShoppingCart } from 'react-icons/fi';
import { useCart, useAuth } from '../hooks';

function Header() {
  const cart = useCart();
  const { user } = useAuth();
  const itemCount = cart.items.length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold gradient-text">Cathy Décor</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-gold transition">Accueil</Link>
            <Link to="/portfolio" className="hover:text-gold transition">Portfolio</Link>
            <Link to="/marketplace" className="hover:text-gold transition">Marketplace</Link>
            <Link to="/salles" className="hover:text-gold transition">Salles</Link>
            <Link to="/services" className="hover:text-gold transition">Services</Link>
            <Link to="/contact" className="hover:text-gold transition">Contact</Link>
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="px-3 py-2 bg-gold text-dark rounded-lg font-semibold hover:opacity-90 transition"
                title="Tableau de bord administrateur"
              >
                🔐 Admin
              </Link>
            )}
            <Link to="/cart" className="relative">
              <FiShoppingCart size={24} className="hover:text-gold transition" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-dark text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Menu Mobile */}
            <button className="md:hidden">
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
