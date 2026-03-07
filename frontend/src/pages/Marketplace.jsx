import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiHeart } from 'react-icons/fi';
import { useCart, useFavorites } from '../hooks';
import api from '../services/api';
import toast from 'react-hot-toast';

function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cart = useCart();
  const favorites = useFavorites();

  const categories = [
    { id: '', name: 'Tous', count: 0 },
    { id: 'mariage', name: 'Mariage', count: 0 },
    { id: 'anniversaire', name: 'Anniversaire', count: 0 },
    { id: 'bapteme', name: 'Baptême', count: 0 },
    { id: 'corporate', name: 'Corporate', count: 0 },
    { id: 'funeraire', name: 'Funéraire', count: 0 },
    { id: 'baby-shower', name: 'Baby Shower', count: 0 },
    { id: 'exterieur', name: 'Extérieur', count: 0 },
    { id: 'interieur', name: 'Intérieur', count: 0 },
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      params.append('limit', 24);

      const response = await api.get(`/decorations?${params}`);
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.data) {
        setProducts(response.data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchPrice;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gold/20 py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Marketplace</h1>
          <p className="text-lg text-gray-600">
            Découvrez et commandez vos décorations d'événement
          </p>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              {/* Search */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Recherche</h3>
                <div className="flex items-center bg-white bg-white rounded-lg overflow-hidden border">
                  <FiSearch className="ml-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Chercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition flex justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-gold text-dark font-bold'
                          : 'hover:bg-gray-200'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-bold text-lg mb-4">Budget</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">
                    {priceRange[0].toLocaleString('fr-FR')} DH - {priceRange[1].toLocaleString('fr-FR')} DH
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-4">Chargement des produits...</p>
                  <div className="inline-block animate-spin">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                  </p>
                  <select className="px-4 py-2 border rounded-lg outline-none">
                    <option>Pertinence</option>
                    <option>Prix: Bas à Haut</option>
                    <option>Prix: Haut à Bas</option>
                    <option>Meilleures notes</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                    >
                      {/* Image */}
                      <div className="relative h-64 bg-gradient-to-br from-gold/20 to-gold/5 overflow-hidden group flex items-center justify-center">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎨</div>
                            <p className="text-sm text-gray-500">{product.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (favorites.isFavorite(product._id)) {
                              favorites.removeFavorite(product._id);
                            } else {
                              favorites.addFavorite(product._id);
                            }
                          }}
                          className={`absolute top-4 right-4 p-2 rounded-full transition ${
                            favorites.isFavorite(product._id)
                              ? 'bg-gold text-dark'
                              : 'bg-white/80 hover:bg-gold hover:text-dark'
                          }`}
                        >
                          <FiHeart size={20} fill={favorites.isFavorite(product._id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.shortDescription}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-gold">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < Math.floor(product.rating || 4) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.reviewCount || 0})</span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-gold">
                            {product.price.toLocaleString('fr-FR')} DH
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => cart.addItem({
                              id: product._id,
                              name: product.name,
                              price: product.price,
                              quantity: 1
                            })}
                            className="w-full btn-primary text-sm"
                          >
                            Ajouter au panier
                          </button>
                          <button className="w-full btn-secondary text-sm py-2">
                            Voir détails
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
