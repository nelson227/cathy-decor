import React, { useState } from 'react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'tous',
    'mariage',
    'anniversaire',
    'baby-shower',
    'bapteme',
    'funeraire',
    'corporate',
    'exterieur',
    'interieur'
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark to-dark text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notre Portfolio</h1>
          <p className="text-lg text-gray-300">
            Découvrez nos réalisations et inspirez-vous pour votre événement
          </p>
        </div>
      </section>

      {/* Search et Filters */}
      <section className="py-8 border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex items-center bg-gray-100 rounded-lg overflow-hidden">
              <FiSearch className="ml-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-gold text-dark rounded-lg hover:bg-opacity-90 transition md:hidden"
            >
              <FiFilter /> Filtres
            </button>
          </div>

          {/* Categories Filter - Desktop */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-lg capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-gold text-dark'
                    : 'bg-gray-200 text-dark hover:bg-gold hover:text-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Categories Filter - Mobile */}
          {showFilters && (
            <div className="md:hidden flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-lg capitalize transition text-left ${
                    selectedCategory === cat
                      ? 'bg-gold text-dark'
                      : 'bg-gray-200 text-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(12)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition"
                >
                  {/* Image */}
                  <div className="h-64 bg-gradient-to-br from-gold to-rose relative overflow-hidden">
                    <div className="absolute inset-0 bg-dark/50 group-hover:bg-dark/30 transition" />
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Événement {i + 1}</h3>
                        <p className="text-sm text-gray-300">Cliquez pour voir les détails</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold mb-2">Décoration Mariage</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      Belle décoration pour mariage clasique et élégant.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-gold bg-opacity-20 text-dark px-3 py-1 rounded-full">
                        Mariage
                      </span>
                      <span className="text-xs bg-gold bg-opacity-20 text-dark px-3 py-1 rounded-full">
                        Luxueux
                      </span>
                    </div>
                    <button className="w-full btn-primary text-sm">
                      Voir le projet
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* No Results */}
          {false && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Intéressé par nos services?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Découvrez notre marketplace pour commander vos décorations
          </p>
          <a href="/marketplace" className="btn-primary">
            Accéder à la marketplace
          </a>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
