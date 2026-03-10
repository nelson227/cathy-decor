import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../hooks';
import api from '../services/api';
import toast from 'react-hot-toast';

// Components
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import MiniCart from '../components/MiniCart';

const CATEGORIES = [
  { id: '', name: 'Tous les articles', slug: '' },
  { id: 'buffets-rechauds', name: 'Buffets & Réchauds', slug: 'buffets-rechauds' },
  { id: 'couverts', name: 'Couverts', slug: 'couverts' },
  { id: 'decoration-table', name: 'Décoration de Table', slug: 'decoration-table' },
  { id: 'mobilier', name: 'Mobilier', slug: 'mobilier' },
  { id: 'structures-chapiteaux', name: 'Structures & Chapiteaux', slug: 'structures-chapiteaux' },
  { id: 'vaisselle-verrerie', name: 'Vaisselle & Verrerie', slug: 'vaisselle-verrerie' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Recommandé' },
  { value: 'newest', label: 'Plus récent' },
  { value: 'price-asc', label: 'Prix (bas à élevé)' },
  { value: 'price-desc', label: 'Prix (élevé à bas)' },
  { value: 'name-asc', label: 'Nom (A-Z)' },
  { value: 'name-desc', label: 'Nom (Z-A)' },
];

function Marketplace() {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([100, 15000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Expandable filters
  const [expandedFilters, setExpandedFilters] = useState({
    prix: true,
    couleur: false,
    diametre: false,
    modele: false,
  });

  // Modal states
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);

  const cart = useCart();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('sortBy', sortBy);
      params.append('priceMin', priceRange[0]);
      params.append('priceMax', priceRange[1]);
      params.append('limit', 50);

      const response = await api.get(`/produits?${params}`);
      setProducts(response.data || []);
      
      // Set category counts
      if (response.categoryCounts) {
        const counts = {};
        response.categoryCounts.forEach(c => {
          counts[c.category] = c.count;
        });
        setCategoryCounts(counts);
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Image URL helper
  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    if (imgUrl.startsWith('http')) return imgUrl;
    if (imgUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      return baseUrl.replace('/api', '') + imgUrl;
    }
    return imgUrl;
  };

  // Filter products by price range
  const filteredProducts = products.filter(p => {
    const price = Number(p.price) || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Toggle filter section
  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    cart.addItem(item);
    toast.success(`${item.name} ajouté au panier`);
  };

  // Get total products count
  const getTotalCount = () => {
    return Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  };

  // Get category count
  const getCategoryCount = (categoryId) => {
    if (!categoryId) return getTotalCount();
    return categoryCounts[categoryId] || 0;
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Floating Cart Button */}
      <button
        onClick={() => setShowMiniCart(true)}
        className="fixed bottom-6 right-6 z-30 bg-primary-dark text-white p-4 rounded-full shadow-lg hover:bg-primary-dark/90 transition"
      >
        <FiShoppingCart size={24} />
        {cart.items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {cart.getItemCount()}
          </span>
        )}
      </button>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Categories Section */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 text-primary-dark">Rechercher par</h3>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left py-2 text-sm transition ${
                          selectedCategory === cat.id
                            ? 'text-primary-dark font-semibold'
                            : 'text-gray-600 hover:text-primary-dark'
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filters Section */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-primary-dark">Filtrer par</h3>
                
                {/* Price Filter */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => toggleFilter('prix')}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900"
                  >
                    <span>Prix</span>
                    {expandedFilters.prix ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  
                  {expandedFilters.prix && (
                    <div className="mt-4">
                      <input
                        type="range"
                        min="100"
                        max="15000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-primary-dark"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>{priceRange[0].toLocaleString('fr-FR')} FCFA</span>
                        <span>{priceRange[1].toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Couleur Filter */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => toggleFilter('couleur')}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900"
                  >
                    <span>Couleur</span>
                    <FiChevronDown className={`transform transition-transform ${expandedFilters.couleur ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilters.couleur && (
                    <div className="mt-3 space-y-2">
                      {['Argent', 'Or', 'Noir', 'Blanc'].map(color => (
                        <label key={color} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input type="checkbox" className="accent-primary-dark" />
                          {color}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Diametre Filter */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => toggleFilter('diametre')}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900"
                  >
                    <span>Diamètre</span>
                    <FiChevronDown className={`transform transition-transform ${expandedFilters.diametre ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Modele Filter */}
                <div className="border-t border-gray-200 py-4">
                  <button
                    onClick={() => toggleFilter('modele')}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900"
                  >
                    <span>Modèle</span>
                    <FiChevronDown className={`transform transition-transform ${expandedFilters.modele ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary-dark mb-2">
                {selectedCategory 
                  ? CATEGORIES.find(c => c.id === selectedCategory)?.name 
                  : 'Tous les articles'}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Sort Bar */}
            <div className="flex justify-end mb-6">
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-dark"
                >
                  <span>Trier par : {SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                  <FiChevronDown className={`transform transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showSortDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[200px]">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                            sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto mb-4"></div>
                  <p className="text-gray-500">Chargement des produits...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPriceRange([100, 15000]);
                  }}
                  className="mt-4 text-primary-dark hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                    onAddToCart={handleAddToCart}
                    getImageUrl={getImageUrl}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => {
          setShowQuickView(false);
          setQuickViewProduct(null);
        }}
        onAddToCart={handleAddToCart}
        getImageUrl={getImageUrl}
      />

      {/* Mini Cart */}
      <MiniCart
        isOpen={showMiniCart}
        onClose={() => setShowMiniCart(false)}
        getImageUrl={getImageUrl}
      />
    </div>
  );
}

export default Marketplace;
