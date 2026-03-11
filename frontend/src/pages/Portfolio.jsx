import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiX, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
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
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [quoteForm, setQuoteForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateEvenement: '',
    nombreInvites: '',
    budget: '',
    message: ''
  });

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
    
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    
    if (imgUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const backendDomain = baseUrl.replace('/api', '');
      return `${backendDomain}${imgUrl}`;
    }
    
    return imgUrl;
  };

  // Modal functions
  const openProject = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    setShowQuoteForm(false);
    document.body.style.overflow = 'auto';
  };

  const openQuoteForm = () => {
    setQuoteForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      dateEvenement: '',
      nombreInvites: '',
      budget: '',
      message: ''
    });
    setShowQuoteForm(true);
  };

  const closeQuoteForm = () => {
    setShowQuoteForm(false);
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

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    
    if (!quoteForm.nom || !quoteForm.prenom || !quoteForm.telephone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Votre demande de devis a été envoyée avec succès!');
      closeQuoteForm();
      closeProject();
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      mariage: 'Mariage',
      anniversaire: 'Anniversaire',
      bapteme: 'Baptême',
      funeraire: 'Funéraire'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-dark to-dark text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Décorations</h1>
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
                  key={project._id || project.id}
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
      {selectedProject && !showQuoteForm && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeProject}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
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
                <button 
                  onClick={openQuoteForm}
                  className="flex-1 btn-primary text-center"
                >
                  Demander un devis
                </button>
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

      {/* Quote Request Modal */}
      {showQuoteForm && selectedProject && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeQuoteForm}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-dark to-gray-800 text-white p-6 rounded-t-xl relative">
              <button 
                onClick={closeQuoteForm}
                className="absolute top-4 right-4 bg-white/20 rounded-full p-2 hover:bg-white/30 transition"
              >
                <FiX size={20} />
              </button>
              <h2 className="text-2xl font-bold">Demande de Devis</h2>
              <p className="text-gray-300 mt-1">Remplissez ce formulaire pour recevoir un devis personnalisé</p>
            </div>

            {/* Project Info Summary */}
            <div className="bg-gold/10 p-4 border-b">
              <h3 className="font-bold text-lg mb-3">Projet sélectionné</h3>
              <div className="flex items-start gap-4">
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <img 
                    src={getImageUrl(selectedProject.images[0])} 
                    alt={selectedProject.name}
                    className="w-24 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-gold text-white px-3 py-1 rounded-full text-sm capitalize">
                      {getCategoryLabel(selectedProject.category)}
                    </span>
                    {selectedProject.theme && (
                      <span className="bg-gray-200 text-dark px-3 py-1 rounded-full text-sm">
                        {selectedProject.theme}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{selectedProject.description}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleQuoteSubmit} className="p-6 space-y-6">
              {/* Informations personnelles */}
              <div>
                <h4 className="font-bold mb-4 text-dark flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-sm">1</span>
                  Vos coordonnées
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.nom}
                      onChange={(e) => setQuoteForm({...quoteForm, nom: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={quoteForm.prenom}
                      onChange={(e) => setQuoteForm({...quoteForm, prenom: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={quoteForm.telephone}
                      onChange={(e) => setQuoteForm({...quoteForm, telephone: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="+237 6XX XXX XXX"
                    />
                  </div>
                </div>
              </div>

              {/* Détails de l'événement */}
              <div>
                <h4 className="font-bold mb-4 text-dark flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-sm">2</span>
                  Détails de votre événement
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <input
                      type="text"
                      value={getCategoryLabel(selectedProject.category)}
                      disabled
                      className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 capitalize"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thème</label>
                    <input
                      type="text"
                      value={selectedProject.theme || 'Non spécifié'}
                      disabled
                      className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de l'événement</label>
                    <input
                      type="date"
                      value={quoteForm.dateEvenement}
                      onChange={(e) => setQuoteForm({...quoteForm, dateEvenement: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre d'invités</label>
                    <input
                      type="number"
                      min="1"
                      value={quoteForm.nombreInvites}
                      onChange={(e) => setQuoteForm({...quoteForm, nombreInvites: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                      placeholder="Ex: 150"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Budget estimé</label>
                    <select
                      value={quoteForm.budget}
                      onChange={(e) => setQuoteForm({...quoteForm, budget: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                    >
                      <option value="">Sélectionnez une fourchette...</option>
                      <option value="moins-500000">Moins de 500 000 FCFA</option>
                      <option value="500000-1000000">500 000 - 1 000 000 FCFA</option>
                      <option value="1000000-2000000">1 000 000 - 2 000 000 FCFA</option>
                      <option value="2000000-5000000">2 000 000 - 5 000 000 FCFA</option>
                      <option value="plus-5000000">Plus de 5 000 000 FCFA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="font-bold mb-4 text-dark flex items-center gap-2">
                  <span className="w-6 h-6 bg-gold text-dark rounded-full flex items-center justify-center text-sm">3</span>
                  Message (optionnel)
                </h4>
                <textarea
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold focus:border-gold"
                  placeholder="Décrivez vos besoins spécifiques, vos préférences ou posez vos questions..."
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      Soumettre la demande
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Nous vous répondrons dans les 24h avec un devis détaillé
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Intéressé par nos services?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Découvrez nos articles en location pour vos événements
          </p>
          <a href="/marketplace" className="btn-primary">
            Voir les articles en location
          </a>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
