import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    'tous',
    'mariage',
    'anniversaire',
    'bapteme',
    'funeraire'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch ALL decorations, we'll filter on frontend
      const response = await api.get('/decorations');
      setProjects(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des projets');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on category and search term
  const filteredProjects = projects.filter((project) => {
    const matchCategory = selectedCategory === 'tous' || project.category === selectedCategory;
    const matchSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.theme?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return '';
    
    // Si c'est déjà une URL complète (API endpoint)
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    
    // Si c'est une URL relative /uploads/decorations/file.jpg
    if (imgUrl.startsWith('/uploads')) {
      // Extraire folder et filename
      const parts = imgUrl.split('/').filter(Boolean); // ['uploads', 'decorations', 'file.jpg']
      if (parts.length >= 3) {
        const folder = parts[1];
        const filename = parts.slice(2).join('/');
        // Utiliser l'endpoint API CORS-safe
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const apiBase = baseUrl.endsWith('/api') ? baseUrl : baseUrl + '/api';
        return `${apiBase}/image/${folder}/${filename}`;
      }
    }
    
    return imgUrl;
  };

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
              className="flex items-center gap-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-opacity-90 transition md:hidden"
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
                    ? 'bg-gold text-white'
                    : 'bg-gray-200 text-dark hover:bg-gold hover:text-white'
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
                      ? 'bg-gold text-white'
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des projets...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun projet trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition"
                >
                  {/* Image */}
                  <div className="h-64 bg-gradient-to-br from-gold to-sky-light relative overflow-hidden">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={getImageUrl(project.images[0])}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/20 transition" />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                      <div className="text-center">
                        <p className="text-sm">Cliquez pour voir les détails</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-gold bg-opacity-20 text-dark px-3 py-1 rounded-full capitalize">
                        {project.category}
                      </span>
                      {project.theme && (
                        <span className="text-xs bg-gold bg-opacity-20 text-dark px-3 py-1 rounded-full">
                          {project.theme}
                        </span>
                      )}
                    </div>
                    <button className="w-full btn-primary text-sm">
                      Voir le projet
                    </button>
                  </div>
                </div>
              ))}
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
