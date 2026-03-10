import React, { useState, useEffect } from 'react';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';

function QuickViewModal({ product, isOpen, onClose, onAddToCart, getImageUrl }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
  const [imageError, setImageError] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setImageError(false);
      // Initialize selected characteristics
      const initialSelections = {};
      if (product.characteristics) {
        Object.keys(product.characteristics).forEach(key => {
          initialSelections[key] = '';
        });
      }
      setSelectedCharacteristics(initialSelections);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const characteristics = product.characteristics || {};
  const hasCharacteristics = Object.keys(characteristics).length > 0;

  // Check if all required characteristics are selected
  const allCharacteristicsSelected = !hasCharacteristics || 
    Object.keys(characteristics).every(key => selectedCharacteristics[key]);

  const handleCharacteristicChange = (key, value) => {
    setSelectedCharacteristics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddToCart = () => {
    if (hasCharacteristics && !allCharacteristicsSelected) {
      return; // Don't add if characteristics not selected
    }

    onAddToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || null,
      quantity,
      selectedCharacteristics: hasCharacteristics ? selectedCharacteristics : {}
    });
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  // Format characteristic key for display
  const formatCharacteristicKey = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <FiX size={24} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="bg-gray-50 p-8 flex items-center justify-center min-h-[400px]">
            {product.images?.[0] && !imageError ? (
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                className="max-w-full max-h-[500px] object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-8xl mb-4">📦</div>
                <p>{product.name}</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            
            <p className="text-xl font-semibold text-primary-dark mb-6">
              {Number(product.price).toLocaleString('fr-FR')} FCFA
            </p>

            {/* Description if available */}
            {product.description && (
              <p className="text-gray-600 text-sm mb-6">
                {product.description}
              </p>
            )}

            {/* Characteristics Selection */}
            {hasCharacteristics && (
              <div className="space-y-4 mb-6">
                {Object.entries(characteristics).map(([key, options]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formatCharacteristicKey(key)} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCharacteristics[key] || ''}
                      onChange={(e) => handleCharacteristicChange(key, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-primary-dark focus:border-primary-dark outline-none"
                    >
                      <option value="">Sélectionner</option>
                      {Array.isArray(options) && options.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité <span className="text-red-500">*</span>
              </label>
              <div className="inline-flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                >
                  <FiMinus size={16} />
                </button>
                <span className="px-6 py-2 font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={hasCharacteristics && !allCharacteristicsSelected}
              className={`w-full py-3 rounded-md font-medium transition flex items-center justify-center gap-2
                ${hasCharacteristics && !allCharacteristicsSelected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-dark text-white hover:bg-primary-dark/90'
                }`}
            >
              Ajouter au panier
            </button>

            {/* More Details Link */}
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-primary-dark hover:underline text-sm"
              >
                Plus de détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
