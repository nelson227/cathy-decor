import React, { useState } from 'react';
import { FiEye, FiShoppingCart } from 'react-icons/fi';

function ProductCard({ product, onQuickView, onAddToCart, getImageUrl }) {
  const [imageError, setImageError] = useState(false);
  
  const hasCharacteristics = product.characteristics && 
    Object.keys(product.characteristics).length > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Si le produit a des caractéristiques à sélectionner, ouvrir le modal
    if (product.requiresSelection || hasCharacteristics) {
      onQuickView(product);
    } else {
      // Sinon, ajouter directement au panier
      onAddToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || null,
        quantity: 1,
        selectedCharacteristics: {}
      });
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.images?.[0] && !imageError ? (
          <img
            src={getImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-2">📦</div>
              <p className="text-sm">{product.name}</p>
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            {/* Aperçu rapide */}
            <button
              onClick={handleQuickView}
              className="text-primary-dark font-medium text-sm hover:underline mb-3 bg-white/90 px-4 py-2 rounded-md shadow-sm"
            >
              Aperçu rapide
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-primary-dark font-semibold">
          {Number(product.price).toLocaleString('fr-FR')} FCFA
        </p>
      </div>

      {/* Add to Cart Button - appears on hover */}
      <div className="px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-dark text-white py-2.5 rounded-md font-medium hover:bg-primary-dark/90 transition flex items-center justify-center gap-2"
        >
          <FiShoppingCart size={16} />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
