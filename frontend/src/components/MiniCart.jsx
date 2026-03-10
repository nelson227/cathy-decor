import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiLock } from 'react-icons/fi';
import { useCart } from '../hooks';

function MiniCart({ isOpen, onClose, getImageUrl }) {
  const cart = useCart();
  const items = cart.items || [];
  const total = cart.getTotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Format selected characteristics for display
  const formatCharacteristics = (selectedCharacteristics) => {
    if (!selectedCharacteristics || Object.keys(selectedCharacteristics).length === 0) {
      return null;
    }
    return Object.entries(selectedCharacteristics)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
      .join(', ');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Panier <span className="text-gray-500">({itemCount} article{itemCount > 1 ? 's' : ''})</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-500">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.cartItemId || item.id} className="flex gap-3 pb-4 border-b">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={getImageUrl ? getImageUrl(item.image) : item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm line-clamp-2 pr-2">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => cart.removeItem(item.cartItemId || item.id)}
                        className="text-gray-400 hover:text-red-500 transition flex-shrink-0"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="text-primary-dark font-medium text-sm mt-1">
                      {Number(item.price).toLocaleString('fr-FR')} XAF
                    </p>
                    
                    {/* Selected Characteristics */}
                    {item.selectedCharacteristics && Object.keys(item.selectedCharacteristics).length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatCharacteristics(item.selectedCharacteristics)}
                      </p>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-gray-200 rounded">
                        <button
                          onClick={() => cart.updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 transition"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => cart.updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 transition"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <span className="font-semibold text-sm">
                        {(Number(item.price) * item.quantity).toLocaleString('fr-FR')} XAF
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            {/* Total */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total estimé</span>
              <span className="text-xl font-bold">
                {total.toLocaleString('fr-FR')} XAF
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Les taxes et les frais d'expédition sont calculés au moment du paiement.
            </p>

            {/* Buttons */}
            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full bg-primary-dark text-white text-center py-3 rounded-md font-medium hover:bg-primary-dark/90 transition mb-2"
            >
              Page de paiement
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              className="block w-full border border-gray-300 text-center py-3 rounded-md font-medium hover:bg-gray-50 transition"
            >
              Voir le panier
            </Link>

            {/* Secure Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm">
              <FiLock size={14} />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MiniCart;
