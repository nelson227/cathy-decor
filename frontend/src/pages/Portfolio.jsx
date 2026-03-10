import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Cleanup: réactiver le scroll si le composant est démonté
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
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
    
    // Si c'est déjà une URL complète
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    
    // Si c'est une URL relative /uploads/...
    if (imgUrl.startsWith('/uploads')) {
      // Construire l'URL complète vers le backend pour les uploads
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const backendDomain = baseUrl.replace('/api', ''); // Enlever /api pour avoir le domaine
      return `${backendDomain}${imgUrl}`;
    }
    
    return imgUrl;
  };

  // Modal functions
  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden'; // Bloquer le scroll du body
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto'; // Réactiver le scroll du body
  };

  const nextImage = () => {
    if (selectedProject && selectedProject.images) {
      setCurrentImageIndex((prev) => 
        prev < selectedProject.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.images) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedProject.images.length - 1
      );
    }
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
                        crossOrigin="anonymous"
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
                    <button 
                      className="w-full btn-primary text-sm"
                      onClick={() => openProject(project)}
                    >
                      Voir le projet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeProject}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-dark">{selectedProject.name}</h2>
              <button 
                onClick={closeProject}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Image Gallery */}
            <div className="relative bg-gray-100">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(selectedProject.images[currentImageIndex])}
                    alt={`${selectedProject.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-[400px] object-contain"
                  />
                  
                  {/* Navigation arrows */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                      >
                        <FiChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                      >
                        <FiChevronRight size={24} />
                      </button>
                      
                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedProject.images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-400">
                  Aucune image disponible
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {selectedProject.images && selectedProject.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                {selectedProject.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Project Details */}
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gold text-white px-3 py-1 rounded-full text-sm capitalize">
                  {selectedProject.category}
                </span>
                {selectedProject.theme && (
                  <span className="bg-gray-200 text-dark px-3 py-1 rounded-full text-sm">
                    {selectedProject.theme}
                  </span>
                )}
              </div>
              
              {selectedProject.description && (
                <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              )}

              {selectedProject.included && selectedProject.included.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Éléments inclus :</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.included.map((item, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <a 
                  href="/contact" 
                  className="flex-1 btn-primary text-center"
                >
                  Demander un devis
                </a>
                <button 
                  onClick={closeProject}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
